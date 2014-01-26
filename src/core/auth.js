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