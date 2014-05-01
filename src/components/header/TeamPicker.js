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
var $ = window.$;

var dataHelper = require('../../core/userDataHelper');

var TeamPicker = React.createClass({

  propTypes: {
    loggedInUser : React.PropTypes.object,
    onUserPicked : React.PropTypes.func
  },

  // jQuery reference to the dropdown to show/hide via toggle button
  $dropdown: null,

  componentDidMount: function() {
    this.$dropdown = $(this.refs.dropdown.getDOMNode());
  },

  handleSelection: function(selectedUserId) {
    this.hideDropdown();
    this.props.onUserPicked(selectedUserId);
  },

  buildUserDetails : function(id, profile, latestNote){

    if (latestNote && latestNote.timestamp) {
      latestNote = 'Last note '+ dataHelper.formatDisplayDate(latestNote.timestamp);
    } else {
      latestNote = 'No notes';
    }

    return {
      userid : id,
      name : dataHelper.formatFullName(profile),
      latestNote : latestNote
    };
  },

  getSelectableUsers : function(teams){

    //logged in user is they are a PWD
    var users = [];

    if(this.props.loggedInUser.isPWD){

      var loggedIn = this.buildUserDetails(
        this.props.loggedInUser.userid,
        this.props.loggedInUser.profile,
        _.first(this.props.loggedInUser.notes)
      );

      users.push(loggedIn);
    }

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

  buildSelectableUsers : function(){
    var selectableUsers = this.getSelectableUsers();

    var users = _.map(selectableUsers, function(selectableUser) {
      return (
        /* jshint ignore:start */
        <div key={selectableUser.userid} ref='group' className='group media group-clickable' onClick={this.handleSelection.bind(null, selectableUser.userid)}>
          <div ref='imgColumn' className='media-object pull-left'>
            <div ref='authorImage' className='group-image'/>
          </div>
          <div ref='teamColumn' className='media-body'>
            <div>
              <strong ref='groupName' className='media-heading' >{selectableUser.name}</strong>
            </div>
            <span ref='lastGroupNote' className='small pull-left'>{selectableUser.latestNote}</span>
          </div>
        </div>
        /* jshint ignore:end */
      );
    }.bind(this));

    return users;
  },

  render:function(){

    var users = this.buildSelectableUsers();

    return this.transferPropsTo(
      /* jshint ignore:start */
      <div ref='selectGroup'>
        <div className='navbar-header'>
          <a className='btn-team-picker btn btn-default navbar-toggle' onClick={this.handleToggleDropdown}>
            <span className='caret'></span>
          </a>
        </div>
        <div ref='dropdown' className='team-picker collapse navbar-collapse' id='groups-navbar'>
          <div ref='groups' className='nav navbar-nav'>
            {users}
          </div>
        </div>
      </div>
      /* jshint ignore:end */
    );
  },

  handleToggleDropdown: function(e) {
    if (e) {
      e.preventDefault();
    }
    this.toggleDropdown();
  },

  toggleDropdown: function() {
    this.$dropdown.collapse('toggle');
  },

  hideDropdown: function() {
    this.$dropdown.collapse('hide');
  }
});

module.exports = TeamPicker;
