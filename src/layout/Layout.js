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

var Layout = React.createClass({

  propTypes: {
    notification: React.PropTypes.object,
    onDismissNotification: React.PropTypes.func
  },
  renderNotification: function() {

    if(this.props.notification){

      var message = this.props.notification.message;
      var alertClasses = 'alert alert-dismissable alert-'+this.props.notification.type;

      return (
        /* jshint ignore:start */
        <div className='layout-alert col-xs-offset-2 col-xs-8 col-sm-offset-4 col-sm-4'>
          <div className={alertClasses}>
            <button type='button' className='close' onClick={this.handleDismiss}>&times;</button>
            {message}
          </div>
        </div>
        /* jshint ignore:end */
      );
    }
    return null;
  },
  handleDismiss: function(e) {
    e.preventDefault();
    var dismiss = this.props.onDismissNotification;
    if (dismiss) {
      dismiss();
    }
  },
  render: function() {

    var notification = this.renderNotification();

    return this.transferPropsTo(
      /* jshint ignore:start */
      <div className='content'>
        {notification}
        {this.props.children}
      </div>
      /* jshint ignore:end */
    );
  }
});

module.exports = Layout;
