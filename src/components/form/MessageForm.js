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
    messagePrompt: React.PropTypes.string,
    onSubmit: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      msg: '',
      when : sundial.utcDateString()
    };
  },

  handleMsgChange: function(e) {
    //set the date first time the user starts typing the message
    if(!this.state.msg){
      this.setState({when: sundial.utcDateString()})
    }
    this.setState({ msg: e.target.value});
  },

  handleWhenChange: function(e) {
  },

  handleSubmit: function(e) {
    if (e) {
      e.preventDefault();
    }

    var submit = this.props.onSubmit;
    if (submit) {

      console.log('set as ',this.state.when);
      console.log('save as ',sundial.formatForStorage(this.state.when));

      submit({text: this.state.msg, when: sundial.formatForStorage(this.state.when) });
    }
    //reset the form
    this.setState({msg : '',when : ''});
  },

  isButtonDisabled: function() {
    var msg = this.state.msg;
    return !(msg && msg.length);
  },

  render: function() {
    return (
      /* jshint ignore:start */
      <form className='messageform'>
        <div className='messageform-when-wrapper'>
          <input
            type='text'
            ref='messageWhen'
            value={sundial.formatForDisplay(this.state.when,'MM-DD h:mm a')}
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
          onClick={this.handleSubmit}>Post</button>
      </form>
      /* jshint ignore:end */
    );
  }
});

module.exports = MessageForm;
