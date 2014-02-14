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

var bows = require('bows');
var _ = require('underscore');

var config = {
  DEMO : true
};

var auth = {
  token: null,
  log: bows('Auth'),

  init: function(callback) {
    console.log('init auth');
    if (config.DEMO) {
      addDemoOverrides(this);
      return this.demoInit(callback);
    }
    callback();
  },

  isAuthenticated: function() {
    return Boolean(this.token);
  }
};

// ---------- BEGIN DEMO OVERRIDES ----------
function addDemoOverrides(auth) {
  _.extend(auth, {
    demoToken: '123',

    // Required method
    demoInit: function(callback) {
      var self = this;

      this.loadSession(function() {
        self.log('[demo] Auth initialized');
        callback();
      });
    },

    loadSession: function(callback) {
      var token;
      var localStorage = window.localStorage;
      if (localStorage && localStorage.getItem) {
        token = localStorage.getItem('demoAuthToken');
        if (token) {
          this.saveSession(token);
        }
        callback();
      }
      else {
        callback();
      }
      this.log('[demo] Session loaded');
    },

    saveSession: function(token) {
      this.token = token;
      var localStorage = window.localStorage;
      if (localStorage && localStorage.setItem) {
        localStorage.setItem('demoAuthToken', token);
      }
    },

    destroySession: function() {
      this.token = null;
      var localStorage = window.localStorage;
      if (localStorage && localStorage.removeItem) {
        localStorage.removeItem('demoAuthToken');
      }
    },

    login: function(username, password, callback) {
      var self = this;
      this.saveSession(self.demoToken);
      this.log('[demo] Login success');
      callback();
    },

    logout: function(callback) {
      this.destroySession();
      this.log('[demo] Logout success');
      callback();
    }

  });

  return auth;
}
// ---------- END DEMO OVERRIDES ----------

module.exports = auth;