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

  // Wordbank vars
  var HASHTAG_REGEX = /#\w+/g;
  var PREDEF_TAGS = ['#juicebox', '#BGnow', '#dessert', '#wopw', '#pizza',
    '#bailey', '#hypo', '#goawaydad', '#biking', '#100woot!'];

  // wordbank memo is keyed by userid to objects. the object interface is:
  //  numMessages: number
  //  wordFreqs: object (words to frequencies)
  //  sortedWords: array<string> (words in descending order by frequency)
  var wordbankMemo = {};

  /*
   * Set info for the logged in user
   */
  function setLoggedInUser(info){
    if(info && info.userid){
      //loggedInUser.user = info.user.user;
      loggedInUser.userid = info.userid;
    }
    if(info && info.details){
      loggedInUser.notes = [];
      loggedInUser.profile = info.details.profile || {};
    }
  }

  /*
   * For a given user get the profile for that user.
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
      }
    }, function (error, results) {
      api.log('return user details');
      user.profile = results.userProfile;
      user.notes = [];
      return cb(error, user);
    });
  }

  /**
   * Get the list of most tagged words for a user's notes. Memoize result.
   * @param userid
   * @param notes
   * @returns {Array}
   */
  function getWordbankWords(user) {
    // TODO: update (rather than recalculate) memo as notes come in
    var userid = user.userid;
    var notes = user.notes;
    var memo, sortedWords;

    // return memoized list if note count is unchanged
    if (wordbankMemo[userid] && wordbankMemo[userid].numMessages === notes.length) {
      return wordbankMemo[userid].sortedWords;
    }

    wordbankMemo[userid] = {
      numMessages: notes.length,
      wordFreqs: {}
    };
    memo = wordbankMemo[userid].wordFreqs;

    PREDEF_TAGS.forEach(function(tag) {
      memo[tag] = 0;
    });

    notes.forEach(function(note) {
      var matches = note.messagetext.match(HASHTAG_REGEX);
      if (matches) {
        matches.forEach(function(match) {
          memo[match] = memo[match] ? memo[match] + 1 : 1;
        });
      }
    });

    sortedWords = Object.keys(memo).sort(function(a, b) {
      // descending sort. values are non-negative, so this won't overflow.
      return memo[b] - memo[a];
    });

    wordbankMemo[userid].sortedWords = sortedWords;

    return sortedWords;
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
   * Return the words in the logged in user's wordbank in descending order by frequency
   */
  api.user.getWordbankWords = function(cb) {
    api.log('getting wordbank of logged in user');
    var loggedInUser = api.user.get();
    if (loggedInUser) {
      return getWordbankWords(loggedInUser);
    }
    return [];
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
    if(!_.isEmpty(config.LONGTERM_KEY)){
      api.log('set the longterm app key');
      user.longtermkey = config.LONGTERM_KEY;
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
   * As the logged start a new thread
   */
  api.notes.add = function(message, callback) {
    api.log('adding new note ... ');
    platform.startMessageThread(message, function(error, id) {
      api.log('added note ... ');
      message.id = id;
      return callback(error, message);
    });
  };

  // ----- Metrics -----

  /*
   * Track a given event
   */
  api.metrics.track = function(eventName) {
    api.log('track metric ' + eventName);

    var properties = { source: 'clamshell' };

    return platform.trackMetric(eventName, properties);
  };

  /*
   * Log this error to the platform
   */
  api.errors.log = function(error, message) {
    api.log('log app error');

    var properties = { source: 'clamshell' };

    return platform.logAppError(error, message, properties);
  };

};
