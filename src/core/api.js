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

var config = {
  DEMO : true
};


var api = {
  log: bows('Api'),

  init: function() {
    if (config.DEMO) {
      addDemoOverrides(this);
    }else{
      addProductionOverrides(this);
    }
  },

  user: {},
  groups: {},
  notes: {}
};

// ---------- BEGIN PRODUCTION OVERRIDES ----------

function addProductionOverrides(api) {


  // ----- User -----
  api.user.get = function(callback) {
    callback(null, []);
  };

  // ----- Groups -----
  api.groups.get = function(userId,callback) {
    callback(null, []);
  };

  // ----- Messages -----
  api.notes.get = function(groupId,callback) {
    callback(null, []);
  };

  return api;
}
// ---------- END PRODUCTION OVERRIDES ----------


// ---------- BEGIN DEMO OVERRIDES ----------
function addDemoOverrides(api) {
  var demoUsers = require('../../demo/data').users;

  var groups = require('../../demo/data').groups;

  // ----- User -----
  api.user.get = function(callback) {
    callback(null, demoUsers[0]);
  };
  // ----- Groups -----
  api.groups.get = function(userId,callback) {
    callback(null, groups);
  };

  return api;
}
// ---------- END DEMO OVERRIDES ----------

module.exports = api;