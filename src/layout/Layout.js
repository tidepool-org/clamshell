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
  getDismissButton:function(){
    var dismiss;

    if(this.props.onDismissNotification){
      /* jshint ignore:start */
      dismiss = (<button type='button' refs='dismissBtn' className='close' onClick={this.handleDismiss}>&times;</button>);
      /* jshint ignore:end */
    }
    return dismiss;
  },
  renderNotification: function() {

    if(this.props.notification){

      var message = this.props.notification.message;
      var alertClasses = 'alert alert-dismissable alert-'+this.props.notification.type;
      var dismiss = this.getDismissButton();

      return (
        /* jshint ignore:start */
        <div className='layout-alert col-xs-offset-2 col-xs-8 col-sm-offset-4 col-sm-4'>
          <div className={alertClasses}>
            {dismiss}
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
