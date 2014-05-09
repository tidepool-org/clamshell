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

require('./MessageForm.less');

// Form for creating new Notes or adding Comments
var MessageForm = React.createClass({
  propTypes: {
    messagePrompt: React.PropTypes.string,
    onSubmit: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      value: ''
    };
  },

  handleChange: function(e) {
    this.setState({value: e.target.value});
  },

  handleSubmit: function(e) {
    if (e) {
      e.preventDefault();
    }

    var submit = this.props.onSubmit;
    if (submit) {
      submit({text: this.state.value});
    }

    this.setState({value: ''});
  },

  isButtonDisabled: function() {
    var value = this.state.value;
    return !(value && value.length);
  },

  render: function() {
    return (
      /* jshint ignore:start */
      <form className='messageform'>
        <div className='messageform-textarea-wrapper'>
          <textarea
            type='textarea'
            rows='1'
            className='messageform-textarea'
            ref='messageText'
            placeholder={this.props.messagePrompt}
            value={this.state.value}
            onChange={this.handleChange}/>
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
