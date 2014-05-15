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

module.exports = function(api, userSchema, platform, config) {
  var async = require('async');
  var _ = require('lodash');

  /*
   * Basic schema for a logged in user
   */
  var loggedInUser = _.cloneDeep(userSchema);

  /*
   * Set info for the logged in user
   */
  function setLoggedInUser(info){
    if(info && info.userid){
      //loggedInUser.user = info.user.user;
      loggedInUser.userid = info.userid;
    }
    if(info && info.details){
      loggedInUser.notes = info.details.notes || [];
      loggedInUser.profile = info.details.profile || {};
    }
  }

  /*
   * For a given user get the profile and notes for that user.
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
        platform.getNotesForUser(userId, null, function(notesError, notes) {
          callback(notesError, notes);
        });
      }
    }, function (error, results) {
      api.log('return user details');
      user.profile = results.userProfile;
      user.notes = appendTeamToNote(results.userNotes, results.userProfile);
      return cb(error, user);
    });
  }

  /*
  * Add the team for each note so we can use it later
  */
  function appendTeamToNote(notes, team) {
    return _.map(notes, function(note) {
      note.team = team;
      return note;
    });
  }

  api.user.isAuthenticated = function(callback) {
    return callback(platform.isLoggedIn());
  };

  // ----- User -----

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
   * Refresh the current user
   */
  api.user.refresh = function(cb){
    if(platform.isLoggedIn()){
      api.log('refreshing logged in user ...');
      platform.getCurrentUser(function(currentUserError,currentUser){
        if(currentUserError){
          return cb(currentUserError);
        }
        setLoggedInUser({userid : currentUser.userid});
        getUserDetail(loggedInUser.userid, function(userDetailError, userDetail) {
          if(userDetailError){
            return cb(userDetailError);
          }
          if (userDetail) {
            api.log('refreshing users data');
            setLoggedInUser({details : userDetail});
          }
          return cb();
        });
      });
    }
  };

  /*
   * Login the user and fetch their data (profile and notes)
   */
  api.user.login = function(user, options, callback) {
    api.log('logging in ...');

    //are we using a long term key?
    if(!_.isEmpty(config.longtermkey)){
      api.log('set the longterm app key');
      user.longtermkey = config.longtermkey;
    }

    platform.login( user, options, function(error, loginData) {
      if (error) {
        api.log.error(error);
        return callback(error);
      }
      if (!_.isEmpty(loginData)) {
        api.log('login success');

        setLoggedInUser({userid : loginData.userid});
        //load all details for the user
        getUserDetail(loggedInUser.userid, function(error, data) {
          if (data) {
            api.log('adding users data');
            setLoggedInUser({details : data});
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

  // ----- Notes -----

  /*
   * Find a specific message thread
   */
  api.notes.getThread = function(messageId, callback) {
    api.log('getting message thread ... ');
    platform.getMessageThread(messageId, function(error, messages) {
      api.log('got message thread');
      return callback(error, messages);
    });
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

  // ----- Metrics -----

  /*
   * Track a given event
   */
  api.metrics.track = function(eventName, properties, cb) {
    api.log('track metric ' + eventName);

    properties = _.assign({
      source: 'clamshell',
      version: config.VERSION
    }, properties);

    return platform.trackMetric(eventName, properties, cb);
  };

  /*
   * Log this error to the platform
   */
  api.errors.log = function(error, message) {
    api.log('log app error ');

    properties = {
      source: 'clamshell',
      version: config.VERSION
    };

    return platform.logAppError(error, message, properties);
  };

};
