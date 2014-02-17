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

var React = require('react');

//Groups chooser
var GroupsPicker = React.createClass({

  handleSelection: function(selectedGroup) {
    this.props.onGroupPicked({groupId:selectedGroup});
    return false;
  },

  render: function() {

    var groups = this.props.groups.map(function(group,i) {
      return (
        /* jshint ignore:start */
        <li key={i}>
        <a ref='groupSelect' href='#' onClick={this.handleSelection.bind(null, group.id)}>
        <p ref='groupName'>{group.name}</p>
        <p ref='lastGroupActivity'>TODO:</p>
        </a>
        </li>
        /* jshint ignore:end */
        );
    }.bind(this));

    return this.transferPropsTo(
      /* jshint ignore:start */
      <div ref='groupsDropDown' className='groupspicker btn-group'>
      <button type='button' className='btn navbar-btn pull-left dropdown-toggle' data-toggle='dropdown'>
      <span className='caret'></span>
      </button>
      <ul ref='groupsList' className='groupspicker-dropdown dropdown-menu' role='menu'>
      {groups}
      </ul>
      </div>
      /* jshint ignore:end */
      );
  }
});

module.exports = GroupsPicker;