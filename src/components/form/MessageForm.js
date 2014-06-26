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
    editNote : React.PropTypes.object,
    messagePrompt : React.PropTypes.string,
    saveBtnText : React.PropTypes.string,
    onCancel : React.PropTypes.func,
    onSubmit : React.PropTypes.func
  },
  getInitialState: function() {
    return this.initialState();
  },
  getDefaultProps: function () {
    return {
      DATE_MASK : 'YYYY-MM-DD',
      TIME_MASK : 'HH:mm',
      EDITED_DATE_MASK : 'YYYY-MM-DD HH:mm',
      cancelBtnText : 'Cancel',
      saveBtnText : 'Post'
    };
  },
  componentDidMount: function () {
    if(this.props.editNote){
      //perset all state for an existing not
      this.setState({
        msg : this.props.editNote.messagetext,
        whenUtc : this.props.editNote.timestamp,
        editing : true,
        changeDateTime : true,
        time : sundial.formatForDisplay(this.props.editNote.timestamp,this.props.TIME_MASK),
        date : sundial.formatForDisplay(this.props.editNote.timestamp,this.props.DATE_MASK)
      });
      this.refs.messageText.getDOMNode().rows = 3;
    }
  },
  /*
   * Declared so that we can reset them easily
   */
  initialState: function(){
    return {
      msg: '',
      whenUtc : null,
      date: null,
      time: null,
      offset : null,
      editing : false,
      changeDateTime : false
    };
  },
  /*
   * If there is now a message show
   * - make sure the current datetime is set
   * - go in to `editing` mode
   *
   * Always keep the msg state current
   */
  handleMsgChange: function(e) {
    this.setState({ msg: e.target.value});
  },
  /*
   * Use the given onCancel handler or just
   * clear the data if there wasn't one given
   */
  handleCancel: function(e) {
    if(this.props.onCancel){
      this.props.onCancel();
    } else {
      this.refs.messageText.getDOMNode().rows = 1;
      this.setState(this.initialState());
    }
  },
  handleDateChange: function(e) {
    this.setState({ date: e.target.value});
  },
  handleTimeChange: function(e) {
    this.setState({ time: e.target.value});
  },
  /*
   * If the date and/or time has been edited format to utc and return that
   * otherwise return the existing utc formated timestamp
   */
  getUtcTimestamp: function() {
    var utcTimestamp = this.state.whenUtc;

    if(this.state.date && this.state.time){
      var offset = sundial.getOffsetFromTime(this.state.whenUtc);
      var editedTimestamp = this.state.date+'T'+this.state.time;
      utcTimestamp =  sundial.formatForStorage(editedTimestamp,offset);
    }

    return utcTimestamp;
  },
  handleSave: function(e) {
    if (e) {
      e.preventDefault();
    }
    if (this.props.onSubmit) {

      this.props.onSubmit({
        text: this.state.msg,
        timestamp: this.getUtcTimestamp()
      });
      this.refs.messageText.getDOMNode().rows = 1;
      this.setState(this.initialState());
    }
  },
  handleGrow:function(e) {
    if (e) {
      e.preventDefault();
    }
    this.refs.messageText.getDOMNode().rows = 3;
    this.setState({ editing: true, whenUtc: sundial.utcDateString()});
  },
  /*
   * Split the timestamp into the date and time
   * components to allow for editing
   */
  showEditDate:function(e){
    if (e) {
      e.preventDefault();
    }
    this.setState({
      changeDateTime : true,
      time : sundial.formatForDisplay(this.state.whenUtc,this.props.TIME_MASK),
      date : sundial.formatForDisplay(this.state.whenUtc,this.props.DATE_MASK)
    });
  },
  isButtonDisabled: function() {
    var msg = this.state.msg;
    return !(msg && msg.length);
  },
  /*
   * Just displays the notes date if it is set
   */
  renderDisplayDate: function(){
    var displayDate;
    if(this.state.whenUtc){
      displayDate = (
        /* jshint ignore:start */
        <div>
          <a className='messageform-change-datetime' href='' ref='showDateTime' onClick={this.showEditDate}>Change</a>
          <label className='messageform-datetime-label'>
            {sundial.formatForDisplay(this.state.whenUtc)}
          </label>
        </div>
        /* jshint ignore:end */
      );
    }
    return displayDate;
  },
  /*
   * Enables the editing of the notes date and time components
   */
  renderEditableDate: function(){
    return (
      /* jshint ignore:start */
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
      /* jshint ignore:end */
    );
  },
  renderButtons: function(){
    return (
      /* jshint ignore:start */
      <div className='messageform-buttons'>
        <button
          type='reset'
          ref='cancelBtn'
          className='messageform-button messageform-button-cancel'
          onClick={this.handleCancel}>
          {this.props.cancelBtnText}
        </button>
        <button
          type='submit'
          ref='sendBtn'
          className='messageform-button messageform-button-save'
          disabled={this.isButtonDisabled()}
          onClick={this.handleSave}>
          {this.props.saveBtnText}
        </button>
      </div>
      /* jshint ignore:end */
    );
  },
  renderTextArea: function(){
    return (
      /* jshint ignore:start */
      <div className='messageform-textarea-wrapper'>
        <textarea
          type='textarea'
          rows='1'
          className='messageform-textarea'
          ref='messageText'
          placeholder={this.props.messagePrompt}
          value={this.state.msg}
          onFocus={this.handleGrow}
          onChange={this.handleMsgChange}/>
      </div>
      /* jshint ignore:end */
    );
  },
  render: function() {

    var date = this.renderDisplayDate();
    var textArea = this.renderTextArea();
    var buttons;

    if(this.state.editing){
      buttons = this.renderButtons();
    }

    if(this.state.changeDateTime){
      date = this.renderEditableDate();
    }

    return (
      /* jshint ignore:start */
      <form ref='messageForm' className='messageform'>
        {date}
        {textArea}
        {buttons}
      </form>
      /* jshint ignore:end */
    );
  }
});

module.exports = MessageForm;
