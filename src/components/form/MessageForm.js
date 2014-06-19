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

require('./MessageForm.less');

// Form for creating new Notes or adding Comments
var MessageForm = React.createClass({
  propTypes: {
    messagePrompt : React.PropTypes.string,
    saveBtnText : React.PropTypes.string,
    onSubmit : React.PropTypes.func
  },
  initialState: function(){
    return {
      msg: null,
      whenUtc : null,
      date: null,
      time: null,
      offset : null,
      changeDateTime : false
    };
  },
  getInitialState: function() {
    return this.initialState();
  },
  getDefaultProps: function () {
    return {
      DATE_MASK : 'YYYY-MM-DD',
      TIME_MASK : 'HH:mm:ss',
      EDITED_DATE_MASK : 'YYYY-MM-DD HH:mm:ss',
      cancelBtnText : 'Cancel',
      saveBtnText : 'Post'
    }
  },
  handleMsgChange: function(e) {
    //set the date first time the user starts typing the message
    if (e.target.value) {
      this.setState({ whenUtc: sundial.utcDateString() , editing: true });
    } else {
      this.setState({ whenUtc: null , editing: false });
    }
    this.setState({ msg: e.target.value});
  },
  handleDateChange: function(e) {
    this.setState({ date: e.target.value});
  },
  handleTimeChange: function(e) {
    this.setState({ time: e.target.value});
  },
  handleSave: function(e) {
    if (e) {
      e.preventDefault();
    }
    var submit = this.props.onSubmit;
    if (submit) {
      submit({
        text: this.state.msg,
        when: this.state.whenUtc
      });
    }
    this.setState(this.initialState);
  },
  showEditDate:function(e){
    if (e) {
      e.preventDefault();
    }
    this.setState({changeDateTime:true});
    console.log('now allow edit')
  },
  isButtonDisabled: function() {
    var msg = this.state.msg;
    return !(msg && msg.length);
  },
  /*
   * Just displays the notes date
   */
  renderDisplayDate: function(){
    var displayDate;
    if(this.state.whenUtc){
      displayDate = sundial.formatForDisplay(this.state.whenUtc);
    }
    return (
      <div ref='showDateTime' onClick={this.showEditDate}>
        <label>{displayDate}</label>
      </div>
    );
  },
  /*
   * Enables the editing of the notes date
   */
  renderEditableDate: function(){
    return (
      <div ref='editDateTime'>
        <input
          type='date'
          ref='editMessageDate'
          value={this.state.date}
          className='messageform-date'
          onChange={this.handleDateChange}/>
        <input
          type='time'
          ref='editMessageTime'
          value={this.state.time}
          className='messageform-time'
          onChange={this.handleTimeChange}/>
      </div>
    );
  },
  /*
   * The buttons
   */
  renderButtons: function(){
    return (
      <button
        type='submit'
        ref='sendBtn'
        className='messageform-button'
        disabled={this.isButtonDisabled()}
        onClick={this.handleSave}>{this.props.saveBtnText}</button>
    );
  },
  render: function() {

    var date = this.renderDisplayDate();
    var buttons;

    if(this.state.editing){
      buttons = this.renderButtons();
    }

    if(this.state.changeDateTime){
      date = this.renderEditableDate();
    }

    return (
      /* jshint ignore:start */
      <form className='messageform'>
        {date}
        <div className='messageform-textarea-wrapper'>
          <textarea
            type='textarea'
            rows='1'
            className='messageform-textarea'
            ref='messageText'
            placeholder={this.props.messagePrompt}
            value={this.state.msg}
            onFocus={this.grow}
            onChange={this.handleMsgChange}/>
        </div>
        {buttons}
      </form>
      /* jshint ignore:end */
    );
  }
});

module.exports = MessageForm;
