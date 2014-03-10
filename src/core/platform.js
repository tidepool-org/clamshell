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
  var async = require('async');
  var _ = require('lodash');

  var token;
  var userid;
  var loggedInUser = {};

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

  function getPatientDetail(patientId, cb) {
    async.waterfall([
      function(callback){
        api.log('[production] getting patients team');
        platform.getUsersTeam(patientId,token,function(teamError,team){
          callback(teamError,team);
        });
      },
      function(team, callback){
        api.log('[production] getting patients profile');
        platform.findProfile(userid,token,function(profileError,profile){
          team.profile = profile;
          callback(profileError,team);
        });
      },
      function(team, callback){
        api.log('[production] getting the patients notes');
        platform.getNotesForTeam(team.id, token, function(notesError,notes){
          team.notes = notes;
          callback(notesError,team);
        });
      }
    ], function (error, teamDetails) {
      api.log('[production] adding details for patient');
      return cb(error,teamDetails);
    });
  }

  // ----- User -----
  api.user.isAuthenticated = function(callback) {
    api.log('[production] is user authenticated?');
    api.user.loadSession(function(hasExistingSession){
      api.log('[production] we have session data: ',hasExistingSession);
      if(hasExistingSession){
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
      }
      return callback(false);
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
    api.log('getting logged in user');
    loggedInUser.userid = userid;
    return loggedInUser;
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
        loggedInUser = loginData.user;
        saveSession(loginData.userid,loginData.token);
      }
      return callback();
    });
  };

  api.user.loadData = function(cb){
    api.log('fetching initial data for user');

    async.series({
      team: function(callback){
        api.user.team.get(callback);
      },
      patients: function(callback){
        api.user.patients.get(callback);
      }
    },
    function(error, results) {
      return cb(error,results);
    });
  };

  api.user.team.get = function(cb) {

    async.waterfall([
      function(callback){
        api.log('[production] getting team');
        platform.getUsersTeam(userid,token,function(teamError,team){
          callback(teamError,team);
        });
      },
      function(team, callback){
        api.log('[production] getting profile for team user');
        platform.findProfile(userid,token,function(profileError,profile){
          team.profile = profile;
          //set the logged in users profile also
          loggedInUser.profile = profile;
          callback(profileError,team);
        });
      },
      function(team, callback){
        api.log('[production] getting notes for team');
        platform.getNotesForTeam(team.id, token, function(notesError,notes){
          team.notes = notes;
          callback(notesError,team);
        });
      }
    ], function (error, teamDetails) {
      api.log('[production] return details for team');
      return cb(error,teamDetails);
    });
  };

  api.user.patients.get = function(cb) {

    var details = [];

    platform.getUsersPatients(userid,token,function(error,userPatients){

      if(userPatients.members){

        var patientIds = _(userPatients.members).uniq().valueOf();

        if(patientIds && patientIds.length>0){

          //call back once all finished
          var done = _.after(patientIds.length, function() {
            return cb(null,details);
          });

          _.forEach(patientIds, function(patientId) {
            getPatientDetail(patientId,function(error,patientsTeam){
              details.push(patientsTeam);
              done();
            });
          });
        }
      }
      //no patients
      return cb(null,details);
    });
  };

  // ----- Messages -----
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