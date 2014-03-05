/*
== BSD2 LICENSE ==
Copyright (c) 2014, Tidepool Project

This program is free software; you can redistribute it and/or modify it under
the terms of the associated License, which is identical to the BSD 2-Clause
License as published by the Open Source Initiative at opensource.org.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the License for more details.

You should have received a copy of the License along with this program; if
not, you can obtain one from Tidepool Project at tidepool.org.
== BSD2 LICENSE ==
*/

'use strict';

module.exports = function(api, host, superagent) {

  var platform = require('platform-client')(host,superagent);

  var token;
  var userid;
  var user;

  function saveSession(newUserid, newToken) {
    token = newToken;
    userid = newUserid;

    var localStorage = window.localStorage;
    if (localStorage && localStorage.setItem) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_id', userid);
      api.log('[production] session saved');
    }

    if (newToken != null) {
      setTimeout(
        function(){
          if (token == null || newUserid !== userid) {
            return;
          }
          platform.refreshUserToken(token,newUserid,function(error,sessionData){
            if(sessionData && sessionData.userid && sessionData.token){
              api.log('[production] token refreshed');
              saveSession(sessionData.userid,sessionData.token);
            }else{
              api.log('[production] token refresh failed: ',error);
            }
          });
        },
        10 * 60 * 1000
      );
    }
  }

  // ----- User -----
  api.user.isAuthenticated = function(callback) {
    api.log('[production] is user authenticated?');
    api.user.loadSession(function(authenticated){
      api.log('[production] we have session data: ',authenticated);
      //refresh token to check
      platform.refreshUserToken(token,userid,function(error,sessionData){
        if(error){
          api.log.info('[production] token not refreshed, user not authenticated');
          return callback(false);
        }
        api.log('[production] token checked and the user is authenticated');
        saveSession(sessionData.userid,sessionData.token);
        return callback(true);
      });
    });
  };

  api.user.deleteSession = function(callback) {
    token = null;
    userid = null;
    var localStorage = window.localStorage;
    if (localStorage && localStorage.getItem) {

      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_id');
      api.log('[production] session removed');
      return callback(true);
    }
    api.log.error('[production] issue removing session');
    return callback(false);
  };

  api.user.loadSession = function(callback) {
    var localStorage = window.localStorage;
    if (localStorage && localStorage.getItem) {
      token = localStorage.getItem('auth_token');
      userid = localStorage.getItem('auth_id');
      if (token && userid) {
        api.log('[production] session loaded');
        return callback(true);
      } else {
        api.log('[production] no session found');
        return callback(false);
      }
    } else {
      api.log.error('[production] issue loading session');
      return callback(false);
    }
  };

  api.user.get = function() {

    if(user){
      return user;
    }

    user = {
      userid : userid
    };

    return user;
  };

  api.user.login = function(username, password,callback) {
    api.log('logging in ...');
    platform.login({username:username,password:password},function(error, loginData){
      if(error){
        api.log.error(error);
        return callback(error);
      }
      if(loginData){
        api.log('[production] login success');
        user = loginData.user;
        saveSession(loginData.userid,loginData.token);
      }
      return callback();
    });
  };

  api.user.team.get = function(callback) {
    platform.getUsersTeam(userid,token,function(error,team){
      if(error){
        api.log.error(error);
       return callback(error,null);
      }
      api.notes.get(team.id,function(notesError,notes){
        if(notesError){
          return callback(notesError,null);
        }
        team.notes = notes;
        api.log('[production] got the team and notes');
        return callback(null,team);
      });
    });
  };

  api.user.patients.get = function(callback) {

    return callback(null,[]);

  };

  // ----- Messages API -----
  api.notes.get = function(groupId,callback) {
    api.log.error('Fix fetching of notes - dates');
    var start = new Date();
    start.setDate(start.getDate()-21);

    var end = new Date();
    api.log('[production] getting all messages ... ');
    platform.getAllMessagesForTeam(groupId,start,end,token,function(error,messages){
      api.log('[production] got all messages');
      return callback(error, messages);
    });
  };

  api.notes.getThread = function(messageId,callback) {
    api.log('[production] getting thread ... ');
    platform.getMessageThread(messageId,token,function(error,messages){
      api.log('[production] got thread');
      return callback(error, messages);
    });
  };

  api.notes.reply = function(comment,callback) {
    api.log('[production] adding reply ... ');
    platform.replyToMessageThread(comment.parentmessage,comment,token,function(error,id){
      api.log('[production] added reply');
      return callback(error);
    });
  };

  api.notes.add = function(message,callback) {
   api.log('[production] adding thread ... ');
    platform.startMessageThread(message.groupid,message,token,function(error,id){
      api.log('[production] added thread ... ');
      return callback(error);
    });
  };
};