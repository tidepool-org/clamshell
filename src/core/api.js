var bows = require('bows');

var config = {
  DEMO : true
};

var api = {
  log: bows('Api'),

  init: function() {
    if (config.DEMO) {
      addDemoOverrides(this);
    }
  },

  user: {},
  groups: {},
  notes: {}
};

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