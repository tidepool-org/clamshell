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

var React = require('react');

var ListNavBar = React.createClass({

  handleAction:function(){
    this.props.onNavBarAction();
  },
  render: function() {
    return (
      /* jshint ignore:start */
      <div className='listnavbar navbar navbar-default navbar-fixed-top yamm' >
        <div className='col-xs-2 col-sm-1'>
          <a href='#' ref='actionBtn' onClick={this.handleAction}>
            <span className={this.props.actionIcon}></span>
          </a>
        </div>
        <h4 className='navbar-text text-center col-xs-7 col-sm-9'>{this.props.title}</h4>
        <span className='pull-right'>
          {this.props.children}
        </span>
      </div>
      /* jshint ignore:end */
    );
  }
});

module.exports = ListNavBar;