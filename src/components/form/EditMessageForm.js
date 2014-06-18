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
  getDefaultProps: function () {
    return {
      DATE_MASK : 'YYYY-MM-DD',
      TIME_MASK : 'HH:mm:ss',
      EDITED_DATE_MASK : 'YYYY-MM-DD HH:mm:ss',
      cancelBtnText : 'Cancel',
      saveBtnText : 'Save'
    }
  },
  getInitialState: function() {
    return {
      msg: this.props.note.messagetext,
      date : sundial.formatForDisplay(this.props.note.timestamp,this.props.DATE_MASK),
      time : sundial.formatForDisplay(this.props.note.timestamp,this.props.TIME_MASK)
    };
  },
  getDateToSave:function(date,time){
    var theMoment = sundial.momentInstance();
    return theMoment(date+' '+time,this.props.EDITED_DATE_MASK).toISOString();
  },
  handleSave: function(e) {
    if (e) {
      e.preventDefault();
    }
    this.props.note.messagetext = this.state.msg;
    this.props.note.timestamp = this.getDateToSave(this.state.date,this.state.time);
    this.props.onSave(this.props.note);
  },
  handleMsgChange: function(e) {
    this.setState({ msg: e.target.value});
  },
  handleDateChange: function(e) {
    console.log(e.target.value);
    this.setState({ date: e.target.value});
  },
  handleTimeChange: function(e) {
    console.log(e.target.value);
    this.setState({ time: e.target.value});
  },
  render: function() {

    return (
      /* jshint ignore:start */
      <form className='editmessageform'>
        <div className='editmessageform-when-wrapper'>
          <input
            type='date'
            ref='editMessageDate'
            value={this.state.date}
            className='editmessageform-date'
            onChange={this.handleDateChange}/>
          <input
            type='time'
            ref='editMessageTime'
            value={this.state.time}
            className='editmessageform-time'
            onChange={this.handleTimeChange}/>
        </div>
        <div className='editmessageform-textarea-wrapper'>
          <textarea
            type='textarea'
            rows='2'
            className='editmessageform-textarea'
            ref='messageText'
            value={this.state.msg}
            onChange={this.handleMsgChange}/>
        </div>
        <button
          type='submit'
          ref='sendBtn'
          className='editmessageform-button'
          onClick={this.handleSave}>{this.props.saveBtnText}</button>
        <button
          type='reset'
          ref='cancelBtn'
          className='editmessageform-button'
          onClick={this.props.onCancel}>{this.props.cancelBtnText}</button>
      </form>
      /* jshint ignore:end */
    );
  }
});

module.exports = MessageEditForm;
