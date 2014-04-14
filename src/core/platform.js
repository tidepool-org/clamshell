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

  var platform = require('tidepool-platform-client/index')({host:host},superagent,api.log);
  var async = require('async');
  var _ = require('lodash');

  var loggedInUser = {};

  function getPatientDetail(patientId, cb) {
    async.waterfall([
      function(callback){
        api.log('[production] getting patients team');
        platform.getUsersTeam(patientId, function(teamError,team){
          callback(teamError,team);
        });
      },
      function(team, callback){
        api.log('[production] getting patients profile');
        platform.findProfile(patientId, function(profileError,profile){
          team.profile = profile;
          callback(profileError,team);
        });
      },
      function(team, callback){
        api.log('[production] getting the patients notes');
        platform.getNotesForTeam(team.id, function(notesError,notes){
          team.notes = notes;
          callback(notesError,team);
        });
      }
    ], function (error, teamDetails) {
      api.log('[production] adding details for patient');
      return cb(error,teamDetails);
    });
  }

  api.user.isAuthenticated = function(callback){
    return callback(platform.isLoggedIn());
  }

  api.user.get = function() {
    api.log('getting logged in user');
    if(platform.isLoggedIn()){
      return loggedInUser;
    }
    return false;
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
        loggedInUser.userid = loginData.userid;
        //saveSession(loginData.userid,loginData.token);
      }
      return callback();
    });
  };

  api.user.logout = function(callback) {
    api.log('logging out ...');
    platform.login(function(error, logoutData){
      if(error){
        api.log.error(error);
        return callback(error);
      }
      api.log('[production] successfully logged out');
      return callback(null,true);
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
        platform.getUsersTeam(loggedInUser.userid, function(teamError,team){
          callback(teamError,team);
        });
      },
      function(team, callback){
        api.log('[production] getting profile for team user');
        platform.findProfile(loggedInUser.userid, function(profileError,profile){
          team.profile = profile;
          //set the logged in users profile also
          loggedInUser.profile = profile;
          callback(profileError,team);
        });
      },
      function(team, callback){
        api.log('[production] getting notes for team');
        platform.getNotesForTeam(team.id, function(notesError,notes){
          team.notes = [];
          if(notes){
            team.notes = notes;
          }
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

    platform.getUsersPatients(loggedInUser.userid, function(error,userPatients){

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
      api.log('[production] user has no patients');
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
    platform.getAllMessagesForTeam(groupId,start,end, function(error,messages){
      api.log('[production] got all messages');
      return callback(error, messages);
    });
  };

  api.notes.getThread = function(messageId,callback) {
    api.log('[production] getting thread ... ');
    platform.getMessageThread(messageId, function(error,messages){
      api.log('[production] got thread');
      return callback(error, messages);
    });
  };

  api.notes.reply = function(comment,callback) {
    api.log('[production] adding reply ... ');
    platform.replyToMessageThread(comment.parentmessage,comment, function(error,id){
      api.log('[production] added reply');
      comment.id = id;
      return callback(error,comment);
    });
  };

  api.notes.add = function(message,callback) {
    api.log('[production] adding thread ... ');
    platform.startMessageThread(message.groupid,message, function(error,id){
      api.log('[production] added thread ... ');
      message.id = id;
      return callback(error,message);
    });
  };
};