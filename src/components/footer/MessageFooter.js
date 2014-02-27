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

var btnDisabled = 'btn btn-default disabled';
var btnEnabled = 'btn btn-default';

//Form for adding Comments
var MessageFooter = React.createClass({

  getInitialState: function() {
    return {btnState: btnDisabled};
  },

  handleMessage: function() {
    var messageText = this.refs.messageText.getDOMNode().value.trim();
    this.props.onFooterAction({text: messageText});
    this.refs.messageText.getDOMNode().value = '';
    this.setState({btnState: btnDisabled});
    return false;
  },

  handleChange: function() {
    var messageText = this.refs.messageText.getDOMNode().value.trim();

    if(messageText.length > 0){
      this.setState({btnState: btnEnabled});
      return false;
    }
    this.setState({btnState: btnDisabled});
    return false;
  },

  renderMessageForm : function(){
    return (
      /* jshint ignore:start */
      <form className='navbar-form'>
        <div className='input-group'>
          <textarea type='textarea' rows='1' className='form-control' ref='messageText' onChange={this.handleChange} placeholder={this.props.messagePrompt}/>
          <span className='input-group-btn'>
            <button type='submit' ref='sendBtn' className={this.state.btnState} onClick={this.handleMessage}>{this.props.btnMessage}</button>
          </span>
        </div>
      </form>
      /* jshint ignore:end */
    );
  },

  render: function() {

    var messageForm  = this.renderMessageForm();

    return this.transferPropsTo(
      /* jshint ignore:start */
      <nav className='messagefooter navbar navbar-default navbar-fixed-bottom'>
        {messageForm}
      </nav>
      /* jshint ignore:end */
      );
  }
});

module.exports = MessageFooter;