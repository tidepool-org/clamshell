/**
 * @jsx React.DOM
 */

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
/* jshint unused: false */

var React = require('react');
var _ = require('lodash');

require('./TeamPicker.less');

var dataHelper = require('../../core/userDataHelper');

var TeamPicker = React.createClass({
  propTypes: {
    loggedInUser : React.PropTypes.object,
    onUserPicked : React.PropTypes.func
  },

  render: function() {
    var users = this.renderSelectableUsers();

    return (
      /* jshint ignore:start */
      <div className='teampicker'>
        <div ref='users' className='teampicker-users'>
          {users}
        </div>
      </div>
      /* jshint ignore:end */
    );
  },

  renderSelectableUsers: function() {
    var self = this;
    var selectableUsers = this.getSelectableUsers();

    var users = _.map(selectableUsers, function(selectableUser) {
      var handleClick = function(e) {
        if (e) {
          e.preventDefault();
        }
        self.handleSelection(selectableUser.userid);
      };

      return (
        /* jshint ignore:start */
        <a
          href=""
          key={selectableUser.userid}
          className='teampicker-user'
          onClick={handleClick}>

          <div className='teampicker-user-info'>
            <div className='teampicker-user-picture'></div>
            <div className='teampicker-user-details'>
              <div className='teampicker-user-name'>
                {selectableUser.name}
              </div>
              <div className='teampicker-user-last-note'>
                {selectableUser.latestNote}
              </div>
            </div>
          </div>

          <div ref='imgColumn' className='teampicker-user-select-icon'></div>
        </a>
        /* jshint ignore:end */
      );
    }.bind(this));

    return users;
  },

  getSelectableUsers: function(teams) {
    //logged in user
    var loggedIn = this.buildUserDetails(
      this.props.loggedInUser.userid,
      this.props.loggedInUser.profile,
      _.first(this.props.loggedInUser.notes)
    );

    var users = [loggedIn];

    //now the team users
    var teamUsers = _.map(this.props.loggedInUser.teams,function(team){
      return this.buildUserDetails(
        team.userid,
        team.profile,
        _.first(team.notes)
      );
    }.bind(this));

    return users.concat(teamUsers);
  },

  buildUserDetails: function(id, profile, latestNote) {
    if (latestNote && latestNote.timestamp) {
      latestNote = 'Last note '+ dataHelper.formatDisplayDate(latestNote.timestamp);
    } else {
      latestNote = 'No notes';
    }

    return {
      userid : id,
      name : dataHelper.formatTeamFullName(profile),
      latestNote : latestNote
    };
  },

  handleSelection: function(selectedUserId) {
    this.props.onUserPicked(selectedUserId);
  }
});

module.exports = TeamPicker;
