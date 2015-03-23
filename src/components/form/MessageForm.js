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

var _ = require('lodash');

var Autocomplete = require('../autocomplete/Autocomplete');
var Wordbank = require('../wordbank/Wordbank');

require('./MessageForm.less');

//number of messageText textarea rows that are displayed depending on state
var EXPANDED_ROWS = 5;
var COLLAPSED_ROWS = 1;

// Form for creating new Notes or adding Comments
var MessageForm = React.createClass({
  propTypes: {
    existingNoteFields : React.PropTypes.object,
    messagePrompt : React.PropTypes.string,
    saveBtnText : React.PropTypes.string,
    onCancel : React.PropTypes.func,
    onSubmit : React.PropTypes.func
  },
  getInitialState: function() {
    return this.initDefault();
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
  isExistingNoteEdit:function() {
    return _.isEmpty(this.props.existingNoteFields) === false;
  },
  hasTextToEdit:function(){
    return this.isExistingNoteEdit() && _.isEmpty(this.props.existingNoteFields.editableText) === false;
  },
  hasTimestampToEdit:function(){
    return this.isExistingNoteEdit() && _.isEmpty(this.props.existingNoteFields.editableTimestamp) === false;
  },
  allowDateEdit:function() {
    return this.hasTimestampToEdit() || this.isExistingNoteEdit() === false;
  },
  /*
   * State as we expect when editing existing message text
   */
  initMessageEdit:function() {
    this.setState({
      msg : this.props.existingNoteFields.editableText,
      whenUtc : this.props.existingNoteFields.displayOnlyTimestamp,
      editing : true
    });
    this.refs.messageText.getDOMNode().rows = EXPANDED_ROWS;
  },
  /*
   * State as we expect when editing existing message text and timestamp
   */
  initMessageAndTimestampEdit:function() {

    var offset = sundial.getOffsetFromTime(this.props.existingNoteFields.editableTimestamp) || sundial.getOffset();

    this.setState({
      msg : this.props.existingNoteFields.editableText,
      whenUtc : this.props.existingNoteFields.editableTimestamp ,
      editing : true,
      changeDateTime : true,
      time : sundial.formatFromOffset(this.props.existingNoteFields.editableTimestamp, offset, this.props.TIME_MASK),
      date : sundial.formatFromOffset(this.props.existingNoteFields.editableTimestamp, offset, this.props.DATE_MASK)
    });
    this.refs.messageText.getDOMNode().rows = EXPANDED_ROWS;
  },
  /*
   * State as we expect starting to add a brand new note
   */
  initAdding:function() {
    if(this.isExistingNoteEdit() === false){
      this.setState({
        whenUtc : sundial.utcDateString(),
        editing : true
      });
    }
    this.refs.messageText.getDOMNode().rows = EXPANDED_ROWS;
  },
  /*
   * Declared so that we can reset them easily
   */
  initDefault: function(){
    //only set if the form has already been created
    if(this.refs.messageText){
      this.refs.messageText.getDOMNode().rows = COLLAPSED_ROWS;
    }
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
   * Init the state expected when the form is loaded
   */
  initMode: function(){
    if(this.hasTextToEdit() && this.hasTimestampToEdit() ){
      this.initMessageAndTimestampEdit();
    } else if(this.hasTextToEdit()){
      this.initMessageEdit();
    }
    //will just be initDefault
  },
  componentDidMount: function () {
    this.initMode();
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
      this.setState(this.initDefault());
    }
  },
  handleDateChange: function(e) {
    this.setState({ date: e.target.value});
  },
  handleTimeChange: function(e) {
    this.setState({ time: e.target.value});
  },
  /*
   * If we are allowing the date to be edited then
   *  - set as the whenUtc date as will be the case for most new dates
   *  - OR if the date has been edited then resolve the date and return
   *
   */
  getUtcTimestamp: function() {
    var utcTimestamp = this.state.whenUtc;

    if( this.allowDateEdit() ){

      if(this.state.date && this.state.time){
        var offset = sundial.getOffsetFromTime(this.state.whenUtc);
        var editedTimestamp = this.state.date+'T'+this.state.time;
        utcTimestamp =  sundial.formatForStorage(editedTimestamp, offset);
      }
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
      this.setState(this.initDefault());
    }
  },
  handleStartAdding:function(e) {
    if (e) {
      e.preventDefault();
    }
    this.initAdding();
  },
  /*
   * Split the timestamp into the date and time
   * components to allow for editing
   */
  showEditDate:function(e){
    if (e) {
      e.preventDefault();
    }

    var offset = sundial.getOffsetFromTime(this.state.whenUtc) || sundial.getOffset();

    this.setState({
      changeDateTime : true,
      time : sundial.formatFromOffset(this.state.whenUtc, offset, this.props.TIME_MASK),
      date : sundial.formatFromOffset(this.state.whenUtc, offset, this.props.DATE_MASK)
    });
  },
  isButtonDisabled: function() {
    var msg = this.state.msg;
    return !(msg && msg.length);
  },
  /*
   * Just displays the notes date if it is set
   */
  renderDisplayDate: function(isExistingNoteEditable){
    var displayDate;
    if(this.state.whenUtc){
      var editLink;
      var offset = sundial.getOffsetFromTime(this.state.whenUtc) || sundial.getOffset();

      if(isExistingNoteEditable){
        editLink = (
          /* jshint ignore:start */
          <a className='messageform-change-datetime' href='' ref='showDateTime' onClick={this.showEditDate}>Change</a>
          /* jshint ignore:end */
        );
      }

      displayDate = (
        /* jshint ignore:start */
        <div>
          {editLink}
          <label className='messageform-datetime-label'>
            {sundial.formatFromOffset(this.state.whenUtc, offset)}
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
          type='time'
          ref='editMessageTime'
          value={this.state.time}
          className='messageform-time'
          onChange={this.handleTimeChange}/>
        <input
          type='date'
          ref='editMessageDate'
          value={this.state.date}
          className='messageform-date'
          onChange={this.handleDateChange}/>
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
          onFocus={this.handleStartAdding}
          onChange={this.handleMsgChange}/>
      </div>
      /* jshint ignore:end */
    );
  },
  renderWordbank: function() {
    return (
      /* jshint ignore:start */
      <Wordbank
        words={this.props.words} />
      /* jshint ignore:end */
    );
  },
  renderAutocomplete: function() {
    return (
      /* jshint ignore:start */
      <Autocomplete
        messageText={this.refs.messageText}
        words={this.props.words} />
      /* jshint ignore:end */
    );
  },
  completeTag: function(event) {
    if (event && event.target) {
      event.preventDefault();
      var tag = event.target.text;
      var caretPos = this.refs.messageText.getDOMNode().selectionStart;
      var msg = this.state.msg;
      var hashPos = msg.substring(0, caretPos).lastIndexOf('#');
      this.refs.messageText.getDOMNode().value = this.state.msg = msg.substring(0, hashPos) + tag + ' ' +
        msg.substring(caretPos, msg.length);
    }
  },
  insertTag: function(event) {
    if (event && event.target) {
      event.preventDefault();
      var tag = event.target.value;
      var caretPos = this.refs.messageText.getDOMNode().selectionStart;
      var msg = this.state.msg;
      this.refs.messageText.getDOMNode().value = this.state.msg = msg.substring(0, caretPos) + tag + ' ' +
        msg.substring(caretPos, msg.length);
    }
  },
  render: function() {
    var date = this.renderDisplayDate(this.allowDateEdit());
    var textArea = this.renderTextArea();
    var words = this.renderWordbank();
    var autocomplete = this.renderAutocomplete();
    var buttons;

    if(this.state.editing){
      buttons = this.renderButtons();
    }

    if(this.state.changeDateTime){
      date = this.renderEditableDate();
    }

    return (
      /* jshint ignore:start */
      <div>
        <div ref='wordbank'
          className='wordbank'
          onClick={this.insertTag}>
          {words}
        </div>
        <form ref='messageForm'
          className='messageform'>
          {date}
          {textArea}
          {buttons}
        </form>
        <div ref='autocomplete'
          className='autocomplete'
          onClick={this.completeTag}>
          {autocomplete}
        </div>
      </div>
      /* jshint ignore:end */
    );
  }
});

module.exports = MessageForm;
