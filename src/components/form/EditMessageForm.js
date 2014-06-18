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
var sundial = require('sundial');

require('./EditMessageForm.less');

// Form for creating new Notes or adding Comments
var MessageEditForm = React.createClass({
  propTypes: {
    note : React.PropTypes.object,
    onCancel : React.PropTypes.func,
    onSave : React.PropTypes.func
  },
  getInitialState: function() {
    return {
      msg: this.props.note.messagetext,
      offset : null
    };
  },
  handleSave: function(e) {
    if (e) {
      e.preventDefault();
    }
    this.props.note.messagetext = this.state.msg;

    this.props.onSave(this.props.note);
  },
  render: function() {

    var DATE_MASK = 'YYYY-MM-DD';
    var TIME_MASK = 'HH:mm:ss';

    var displayDate = sundial.formatForDisplay(this.props.note.timestamp,DATE_MASK);
    var displayTime = sundial.formatForDisplay(this.props.note.timestamp,TIME_MASK);

    return (
      /* jshint ignore:start */
      <form className='editmessageform'>
        <div className='editmessageform-when-wrapper'>
          <input
            type='date'
            ref='editMessageDate'
            placeholder={DATE_MASK}
            value={displayDate}
            className='editmessageform-date'/>
          <input
            type='time'
            ref='editMessageTime'
            placeholder={TIME_MASK}
            value={displayTime}
            className='editmessageform-time'/>
        </div>
        <div className='editmessageform-textarea-wrapper'>
          <textarea
            type='textarea'
            rows='1'
            className='editmessageform-textarea'
            ref='messageText'
            value={this.state.msg}/>
        </div>
        <button
          type='submit'
          ref='sendBtn'
          className='editmessageform-button'
          onClick={this.handleSave}>Save</button>
        <button
          type='reset'
          ref='cancelBtn'
          className='editmessageform-button'
          onClick={this.props.onCancel}>Cancel</button>  
      </form>
      /* jshint ignore:end */
    );
  }
});

module.exports = MessageEditForm;
