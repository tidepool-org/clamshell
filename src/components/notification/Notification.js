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

require('./Notification.less');

var Notification = React.createClass({
  propTypes: {
    notification: React.PropTypes.object,
    onClose: React.PropTypes.func
  },

  render: function() {
    var notification = this.props.notification;
    var type = notification.type || 'alert';
    var className = 'notification notification-' + type;
    var message = notification.info.message;
    var errorDetail = this.renderErrorDetails(notification.info.details);

    var closeLink = this.renderCloseLink();

    return (
      /* jshint ignore:start */
      <div className={className} ref='notification'>
        <span className="notification-message" ref='message'>{message}</span>
        {errorDetail}
        {closeLink}
      </div>
      /* jshint ignore:end */
    );
  },

  renderErrorDetails:function(details){

    if(!details){
      return null;
    }

    return (
      /* jshint ignore:start */
      <p className='notification-details' ref='details'>
        {JSON.stringify(details)}
      </p>
      /* jshint ignore:end */
    );
  },

  renderCloseLink: function() {
    if (!this.props.onClose) {
      return null;
    }

    return (
      /* jshint ignore:start */
      <a
        className="notification-close"
        href=""
        onClick={this.handleClose}
        ref='close'>Close</a>
      /* jshint ignore:end */
    );
  },

  handleClose: function(e) {
    if (e) {
      e.preventDefault();
    }
    var stateOnClosing = this.props.notification.stateOnClosing || {};
    this.props.onClose(stateOnClosing);
  }
});

module.exports = Notification;
