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

require('./TeamPicker.css');

var TeamPicker = React.createClass({

  handleSelection: function(selectedGroup) {
    this.props.onGroupPicked({groupId:selectedGroup});
  },

  render:function(){

    var groups = this.props.groups.map(function(group,i) {
      return (
        <div key={i} ref='group' className='group media'>
          <div ref='imgColumn' className='media-object pull-left'>
            <div ref='authorImage' className='group-image'/>
          </div>
          <div ref='teamColumn' className='media-body' onClick={this.handleSelection.bind(null, group.id)}>
            <div>
              <strong ref='groupName' className='media-heading' >{group.profile.shortname}</strong>
            </div>
            <span ref='lastGroupNote' className='small pull-left'>Last note ...</span>
          </div>
        </div>
      );
    }.bind(this));

    return this.transferPropsTo(
      <div ref='selectGroup'>
        <div className='navbar-header'>
          <a className='btn-team-picker btn btn-default navbar-toggle' data-toggle='collapse' data-target='#groups-navbar'>
            <span className='caret'></span>
          </a>
        </div>
        <div className='team-picker collapse navbar-collapse' id='groups-navbar'>
          <div className='nav navbar-nav'>
            {groups}
          </div>
        </div>
      </div>
    );
  }

});

module.exports = TeamPicker;