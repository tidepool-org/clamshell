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
  getInitialState: function() {
    return {
      msg: null,
      whenDisplay : null,
      whenUtc : null,
      offset : null
    };
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
    if(!this.state.msg){
      this.setState({whenUtc: sundial.utcDateString()})
    }
    this.setState({ msg: e.target.value});
  },
  handleWhenChange: function(e) {
  },
  resetState: function(){
    this.setState({
      msg: null,
      when : null,
      offset : null
    });
  },
  handleSave: function(e) {
    if (e) {
      e.preventDefault();
    }
    var submit = this.props.onSubmit;
    if (submit) {
      submit({
        text: this.state.msg,
        when: sundial.formatForStorage(this.state.when)
      });
    }
    this.resetState();
  },
  isButtonDisabled: function() {
    var msg = this.state.msg;
    return !(msg && msg.length);
  },
  render: function() {

    var displayDate;

    if(this.state.when){
      displayDate = sundial.formatForDisplay(this.state.whenUtc,'YYYY-MM-DD h:mm a');
    }

    return (
      /* jshint ignore:start */
      <form className='messageform'>
        <div className='messageform-when-wrapper'>
          <input
            type='text'
            ref='messageWhen'
            placeholder={'YYYY-MM-DD h:mm a'}
            value={displayDate}
            className='messageform-when'
            onChange={this.handleWhenChange}/>
        </div>
        <div className='messageform-textarea-wrapper'>
          <textarea
            type='textarea'
            rows='1'
            className='messageform-textarea'
            ref='messageText'
            placeholder={this.props.messagePrompt}
            value={this.state.msg}
            onChange={this.handleMsgChange}/>
        </div>
        <button
          type='submit'
          ref='sendBtn'
          className='messageform-button'
          disabled={this.isButtonDisabled()}
          onClick={this.handleSave}>{this.props.saveBtnText}</button>
      </form>
      /* jshint ignore:end */
    );
  }
});

module.exports = MessageForm;
