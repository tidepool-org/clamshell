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

var TeamPicker = React.createClass({

  handleSelection: function(selectedGroup) {
    this.props.onGroupPicked({groupId:selectedGroup});
    return false;
  },

  render:function(){

    var groups = this.props.groups.map(function(group,i) {
      return (
        <div key={i} className="row col-xm-12">
          <div className="col-xm-2">
          </div>
          <div className="col-xs-offset-2 col-xm-10">
            <a ref='groupSelect' href='#' onClick={this.handleSelection.bind(null, group.id)}>
              <p ref='groupName'>TODO: {group.id}</p>
            </a>
          </div>
        </div>
      );
    }.bind(this));

    return this.transferPropsTo(
      <div id="navbar-collapse-grid" className="navbar-collapse in">
        <ul className="nav navbar-nav">
          <li className="dropdown yamm-fw">
            <a href="#" data-toggle="dropdown" className="dropdown-toggle">
              <span className='dropdown-icon'></span>
            </a>
            <ul className="dropdown-menu">
              <li className="grid-demo">
                {groups}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }

});

module.exports = TeamPicker;