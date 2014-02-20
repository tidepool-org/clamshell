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
      console.log('[production] session saved');
      api.log('[production] session saved');
    }

    if (newToken != null) {
      setTimeout(
        function(){
          if (token == null || newUserid !== userid) {
            return;
          }
          platform.refreshUserToken(token,newUserid,function(error,sessionData){
            console.log('[production] token refreshed');
            api.log('[production] token refreshed');
            saveSession(sessionData.userid,sessionData.token);
          });
        },
        10 * 60 * 1000
      );
    }
  }

  // ----- User -----

  api.user.isAuthenticated = function() {
    return Boolean(token);
  };

  api.user.deleteSession = function(callback) {
    token = null;
    userid = null;
    var localStorage = window.localStorage;
    if (localStorage && localStorage.getItem) {

      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_id');
      console.log('[production] session removed');
      api.log('[production] session removed');
      return callback(true);
    }
    return callback(false);
  };

  api.user.loadSession = function(callback) {
    var localStorage = window.localStorage;
    if (localStorage && localStorage.getItem) {
      token = localStorage.getItem('auth_token');
      userid = localStorage.getItem('auth_id');
      if (token && userid) {
        saveSession(userid,token);
      }
      return callback(true);
      api.log('[production] session loaded');
      console.log('[production] session loaded');
    }
    return callback(false);
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
    console.log('logging in ...');
    api.log('logging in ...');
    platform.login({username:username,password:password},function(error, loginData){
      if(error){
        return callback(error);
      }
      if(loginData){
        console.log('[production] login success');
        api.log('[production] login success');
        user = loginData.user;
        saveSession(loginData.userid,loginData.token);
      }
      callback();
    });
  };

  api.user.team.get = function(callback) {
    platform.getGroupForUser(userid,'team',token,function(error,team){
      if(error){
        callback(error,null);
      }
      api.notes.get(team.id,function(notesError,notes){
        if(notesError){
          return callback(notesError,null);
        }
        team.notes = notes;
        console.log('[production] got the team and notes');
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
    //TODO  set as three weeks ago
    console.log('Fix TODO');
    var start = new Date();
    start.setDate(start.getDate()-21);

    var end = new Date();
    console.log('[production] getting all messages ... ');
    api.log('[production] getting all messages ... ');
    platform.getAllMessagesForTeam(groupId,start,end,token,function(error,messages){
      console.log('[production] got all messages');
      api.log('[production] got all messages');
      callback(error, messages);
    });
  };

  api.notes.getThread = function(groupId,callback) {
    console.log('[production] getting thread ... ');
    api.log('[production] getting thread ... ');
    platform.getAllMessagesForTeam(groupId,token,function(error,messages){
      console.log('[production] got thread');
      api.log('[production] got thread');
      callback(error, messages);
    });
  };

  api.notes.reply = function(comment,callback) {
    console.log('[production] adding reply ... ');
    api.log('[production] adding reply ... ');
    platform.replyToMessageThread(comment.parentmessage,comment,token,function(error,id){
      console.log('[production] added reply');
      api.log('[production] added reply');
      callback(error);
    });
  };

  api.notes.add = function(message,callback) {
    console.log('[production] adding thread ... ');
    api.log('[production] adding thread ... ');
    platform.startMessageThread(message.groupid,message,token,function(error,id){
      console.log('[production] added thread ... ');
      api.log('[production] added thread ... ');
      callback(error);
    });
  };
};