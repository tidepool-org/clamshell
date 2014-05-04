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

module.exports = function(api) {
  var _ = require('lodash');

  var demoData = require('../../demo/data');
  var loggedInUser = demoData.loggedInUser;
  var allMessages = loggedInUser.notes
    .concat(_.flatten(loggedInUser.teams, 'notes'));

  var token = null;
  var demoToken = '123456789';

  loadSession();

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

  api.user.login = function(username, password,callback) {
    api.log('[mock] logging in ...');
    saveSession(demoToken);
    api.log('[mock] login success');
    callback();
  };

  api.user.logout = function(callback) {
    api.log('[mock] logging out ...');
    destroySession();
    api.log('[mock] successfully logged out');
    return callback(null);
  };

  api.user.refresh = function(callback) {
    api.log('[mock] refresh data ...');
    loggedInUser = demoData.loggedInUser;
    api.log('[mock] refreshed data');
    return callback();
  };

  // ----- Teams -----
  api.user.teams.get = function(callback) {
    // Already attached to `loggedInUser.teams`
    api.log('[mock] successfully got users teams data');
    return callback();
  };

  api.user.teams.refresh = function(callback){
    // Already attached to `loggedInUser.teams`
    api.log('[mock] successfully refreshed users teams data');
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
    message.id = id;
    allMessages.push(message);
    return callback(null,message);
  };
};
