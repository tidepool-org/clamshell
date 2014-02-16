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

  var team = require('../../demo/data').team;
  var patients = require('../../demo/data').patients;

  var token = null;
  var demoToken = '123456789';


  function saveSession(newToken) {
    token = newToken;
    var localStorage = window.localStorage;
    if (localStorage && localStorage.setItem) {
      localStorage.setItem('demoAuthToken', token);
    }
  }

  // ----- User -----

  api.user.isAuthenticated = function() {
    return Boolean(token);
  };

  api.user.login = function(username, password,callback) {
    saveSession(demoToken);
    console.log('[demo] Login success');
    callback();
  };

  api.user.team.get = function(callback) {
    callback(null,team);
  };

  api.user.patients.get = function(userId,callback) {
    return callback(null,patients);
  };

  // ----- Messages -----
  api.notes.get = function(groupId,callback) {
    return callback(null,team.messages);
  };

  api.notes.getThread = function(messageId,callback) {
    return callback(null,team.messages);
  };

  api.notes.reply = function(messageId,comment,callback) {
    var id = 'mock_reply_'+Math.floor((Math.random()*1000)+1);
    console.log('reply id ',id);
    return callback(null,id);
  };

  api.notes.add = function(groupId,message,callback) {
    var id = 'mock_note_'+Math.floor((Math.random()*1000)+1);
    console.log('note id ',id);
    return callback(null,id);
  };

};