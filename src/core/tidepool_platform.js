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

var migrations = require('./apimigrations');

module.exports = function(api, platform, config) {
  var async = require('async');
  var _ = require('lodash');

  var loggedInUser = {};

  /*
   * For a given user get the profile and notes for that user.
   *
   */
  function getUserDetail(userId, cb) {

    var user = { userid : userId };

    async.parallel({
      userProfile: function(callback) {
        api.log('getting user profile');

        platform.findProfile(userId, function(profileError,profile){
          if (profileError) {
            return callback(profileError);
          }

          var migration = migrations.profileFullName;
          if (migration.isRequired(profile)) {
            api.log('Migrating user [' + userId + '] profile to "fullName"');
            profile = migration.migrate(profile);
          }

          callback(profileError,profile);
        });
      },
      userNotes: function(callback) {
        api.log('getting user notes');
        platform.getNotesForUser(userId, null, callback);
      }
    }, function (error, results) {
      api.log('return user details');
      user.profile = results.userProfile || {};
      user.notes = appendTeamToNote(results.userNotes, results.userProfile);
      return cb(null, user);
    });
  }

  /*
  * Add the team for each note so we can use it later
  */
  function appendTeamToNote(notes,team){
    if(notes && team){
      return _.map(notes, function(note) {
        note.team = team;
        return note;
      });
    }
  }

  api.user.isAuthenticated = function(callback) {
    return callback(platform.isLoggedIn());
  };

  /*
   * Return the logged in user
   */
  api.user.get = function() {
    api.log('getting logged in user');
    if (platform.isLoggedIn()) {
      return loggedInUser;
    }
    return false;
  };

  /*
   * Refresh the logged in user
   */
  api.user.refresh = function(cb) {
    api.log('refreshing data ...');
    getUserDetail(loggedInUser.userid,function(err,details){
      if (err != null) {
        api.log('Error when refreshing details for the logged in user', loggedInUser.userid, err);
      } else if (_.isArray(details) && details.length > 0) {
        api.log('refreshed logged in user');
        loggedInUser.notes = details.notes;
        loggedInUser.profile = details.profile;
      }
      return cb();
    });
  };

  /*
   * Login the user and fetch their data (profile and notes)
   */
  api.user.login = function(username, password, callback) {
    api.log('logging in ...');
    platform.login({
      username:username,
      password:password,
      longtermkey: config.longtermkey
    }, function(error, loginData) {
      if (error) {
        api.log.error(error);
        return callback(error);
      }
      if (loginData) {
        api.log('login success');
        loggedInUser = loginData.user;
        loggedInUser.userid = loginData.userid;
        getUserDetail(loggedInUser.userid, function(error, data) {
          if (data) {
            api.log('adding users data');
            loggedInUser.notes = data.notes;
            loggedInUser.profile = data.profile;
          }
          return callback(error);
        });
      }
    });
  };

  /*
   * Logout user
   */
  api.user.logout = function(callback) {
    api.log('logging out ...');
    platform.logout(function(error, logoutData) {
      if (error) {
        api.log.error(error);
        return callback(error);
      }
      api.log('successfully logged out');
      return callback(null);
    });
  };

  /*
   * For the logged in user get all linked users (i.e. your in the team)
   * This will find the linked users profile and notes
   */
  api.user.teams.get = function(cb) {
    loggedInUser.teams = [];

    platform.getViewableUsers(loggedInUser.userid, function(error, viewableUsers) {

      var linkedUsers = Object.keys(_.omit(viewableUsers, loggedInUser.userid));

      if (linkedUsers.length > 0) {
        async.map(linkedUsers, getUserDetail, function(err, details) {
          if (err != null) {
            api.log('Error when fetching details for a linked user', loggedInUser.userid, err);
          } else if (_.isArray(details) && details.length > 0) {
            api.log('Successfully got users teams data');
            loggedInUser.teams = details;
          }
          return cb();
        });
      } else {
        api.log('user has no other teams');
        return cb();
      }
    });
  };

  /*
   * Refresh any teams
   */
  api.user.teams.refresh = function(cb){
    if(_.isEmpty(loggedInUser.teams)){
      return cb();
    }

    var teamIds = _.pluck(loggedInUser.teams, 'userid');

    async.map(teamIds, getUserDetail, function(err, details){
      if (err != null) {
        api.log('Error when refreshing details for a linked user', loggedInUser.userid, err);
      } else if (_.isArray(details) && details.length > 0) {
        api.log('Successfully refreshed users teams data');
        loggedInUser.teams = details;
      }
      return cb();
    });
  };

  /*
   * Find a specific message thread
   */
  api.notes.getThread = function(messageId, callback) {
    api.log('getting message thread ... ');
    platform.getMessageThread(messageId, callback);
  };

  /*
   * As the logged in user reply on an existing thread
   */
  api.notes.reply = function(comment, callback) {
    api.log('adding reply to message thread ... ');
    platform.replyToMessageThread(comment, function(error, id) {
      api.log('reply added to message thread');
      comment.id = id;
      return callback(error, comment);
    });
  };

  /*
   * As the logged start a new thread
   */
  api.notes.add = function(message, callback) {
    api.log('adding new message thread ... ');
    platform.startMessageThread(message, function(error, id) {
      api.log('added message thread ... ');
      message.id = id;
      return callback(error, message);
    });
  };
};
