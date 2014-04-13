/** @jsx React.DOM */
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

var React = require('react');

var Notification = React.createClass({
  propTypes: {
    message: React.PropTypes.string
  },
  render: function() {

    if(this.props.message){
      return (
        /* jshint ignore:start */
        <div className="alert alert-warning alert-dismissable">
          <button type="button" className="close" data-dismiss="alert" aria-hidden="true">&times;</button>
          {this.props.message}
        </div>
        /* jshint ignore:end */
      );
    }
    return null;
  }
});

module.exports = Notification;