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
    console.log('save session');
    token = newToken;
    userid = newUserid;
    if (newToken != null) {
      setTimeout(
        function(){
          if (token == null || newUserid !== userid) {
            return;
          }
          platform.refreshUserToken(token,newUserid,function(error,sessionData){
            console.log('token refresh ');
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

  api.user.get = function() {
    return user;
  };

  api.user.login = function(username, password,callback) {
    console.log('Logining in ...');
    platform.login({username:username,password:password},function(error, loginData){
      if(loginData){
        console.log('[production] Login success');
        console.log('[production] data: ',loginData);
        user = loginData.user;
        saveSession(loginData.userid,loginData.token);
      }
      callback();
    });
  };

  api.user.team.get = function(callback) {
    console.log('[production] token: ',token);
    platform.getGroupForUser(userid,'team',token,function(error,team){
      if(error){
        callback(error,null);
      }
console.log('[production] the team: ',team);
      api.notes.get(team.id,function(notesError,notes){
        if(notesError){
          return callback(notesError,null);
        }
        console.log('[production] the notes: ',notes);
        team.notes = notes;
        return callback(null,team);
      });
    });
  };

  api.user.patients.get = function(callback) {

    return callback(null,[]);

  };

  // ----- Messages API -----
  api.notes.get = function(groupId,callback) {

    console.log('[production] token: ',token);
    //TODO  set as three weeks ago
    var start = new Date();
    start.setDate(start.getDate()-21);

    var end = new Date();
    platform.getAllMessagesForTeam(groupId,start,end,token,function(error,messages){
      callback(error, [messages]);
    });
  };

  api.notes.getThread = function(groupId,callback) {
    platform.getAllMessagesForTeam(groupId,token,function(error,messages){
      callback(error, [messages]);
    });
  };

  api.notes.reply = function(messageId,comment,callback) {
    platform.replyToMessageThread(messageId,comment,token,function(error,id){
      if(id){
        comment.id = id;
      }
      callback(error, comment);
    });
  };

  api.notes.add = function(groupId,message,callback) {
    platform.startMessageThread(groupId,message,token,function(error,id){
      if(id){
        message.id = id;
      }
      callback(error, message);
    });
  };
};