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

var mockData = require('./data');

module.exports = function(api, userSchema) {
  var _ = require('lodash');

  var loggedInUser = _.cloneDeep(userSchema);
  var allMessages;

  var token = null;
  var demoToken = '123456..99..100';

  function loadSession() {
    var localStorage = window.localStorage;
    if (localStorage && localStorage.getItem) {
      var savedToken = localStorage.getItem('demoAuthToken');
      if (savedToken) {
        saveSession(savedToken);
        api.log('[mock] user has saved session');
      }
    }
  }

  function saveSession(newToken) {
    token = newToken;
    var localStorage = window.localStorage;
    if (localStorage && localStorage.setItem) {
      localStorage.setItem('demoAuthToken', token);
    }
  }

  function destroySession() {
    token = null;
    var localStorage = window.localStorage;
    if (localStorage && localStorage.removeItem) {
      localStorage.removeItem('demoAuthToken');
    }
  }

  function loadUserData(data){
    loggedInUser = data.loggedInUser;
    allMessages = loggedInUser.notes.concat(_.flatten(loggedInUser.teams, 'notes'));
  }

  // ----- User -----

  api.user.isAuthenticated = function(callback) {
    return callback(Boolean(token));
  };

  api.user.get = function() {
    api.log('[mock] getting logged in user');
    if(token){
      return loggedInUser;
    }
    return false;
  };

  api.user.login = function(user, options, callback) {
    api.log('[mock] logging in ...');
    if(_.isEmpty(user.username) || _.isEmpty(user.password)){
      return callback('missing user details');
    }
    saveSession(demoToken);
    loadUserData(mockData);
    api.log('[mock] login success');
    return callback();
  };

  api.user.refresh = function(callback){
    api.log('[mock] refresh in ...');
    saveSession(demoToken);
    loadUserData(mockData);
    return callback();
  };

  api.user.logout = function(callback) {
    api.log('[mock] logging out ...');
    destroySession();
    api.log('[mock] successfully logged out');
    return callback(null);
  };

  api.user.teams.get = function(callback) {
    // Already attached to `loggedInUser.teams`
    api.log('[mock] successfully got users teams data');
    return callback();
  };

  // ----- Messages -----
  api.notes.getThread = function(messageId,callback) {
    api.log('[mock] getting message thread ... ');
    var messages = _.filter(allMessages, function(message) {
      return (message.id === messageId || message.parentmessage === messageId);
    });
    api.log('[mock] got message thread');
    return callback(null,messages);
  };

  api.notes.reply = function(comment,callback) {
    api.log('[mock] adding reply to message thread ... ');
    var id = 'mock_reply_'+Math.floor((Math.random()*1000)+1);
    comment.id = id;
    allMessages.push(comment);
    api.log('[mock] reply added to message thread');
    return callback(null,comment);
  };

  api.notes.add = function(message,callback) {
    api.log('[mock] adding new message thread ... ');
    var id = 'mock_note_'+Math.floor((Math.random()*1000)+1);
    api.log('[mock] added message thread ... ');
    message.parentmessage = null;
    message.id = id;
    allMessages.push(message);
    return callback(null,message);
  };

  api.notes.edit = function(message,callback) {
    api.log('[mock] editing a message ');
    return callback(null);
  };

  // ----- Metrics -----

  api.metrics.track = function(eventName, properties, cb) {
    api.log('[mock] track metric ' + eventName);

    if (typeof cb === 'function') {
      cb();
    }
  };

  /*
   * Log this error to the platform
   */
  api.errors.log = function(error, message) {
    api.log('log app error ',error);
  };

  return{
    initialize : function(cb){
      loadSession();
      return cb();
    }
  };
};
