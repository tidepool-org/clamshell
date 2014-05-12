/**
 * @jsx React.DOM
 */

/**
 * Copyright (c) 2014, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

'use strict';
/* jshint unused: false */

var React = require('react');

require('./LoggedInAs.less');

var dataHelper = require('../../core/userDataHelper');

var LoggedInAs = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    onLogout: React.PropTypes.func
  },

  render: function() {
    return (
      /* jshint ignore:start */
      <div className='loggedinas'>
        <span className='loggedinas-inline loggedinas-copy'>
          {'Logged in as'}
        </span>
        <span className='loggedinas-inline loggedinas-name' ref='name'>
          {this.getUserDisplayName(this.props.user)}
        </span>
        <span className='loggedinas-inline loggedinas-separator'>
          {'•'}
        </span>
        <a
          href=''
          className='loggedinas-inline loggedinas-logout'
          onClick={this.handleLogout}
          ref='logout'>Logout</a>
      </div>
      /* jshint ignore:end */
    );
  },

  getUserDisplayName: function(user) {
    return dataHelper.formatFullName(user && user.profile);
  },

  handleLogout: function(e) {
    if (e) {
      e.preventDefault();
    }

    var logout = this.props.onLogout;
    if (logout) {
      logout();
    }
  }
});

module.exports = LoggedInAs;
