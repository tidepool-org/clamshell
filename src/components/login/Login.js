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

require('./Login.less');

var Login = React.createClass({

  propTypes: {
    login: React.PropTypes.func,
    onLoginSuccess: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      loggingIn: false,
      message: ''
    };
  },
  renderLogos: function(){
    /* jshint ignore:start */
    return (
      <div className='login-logos'>
        <div className='login-tidepool-logo'></div>
        <div className='login-blip-logo'></div>
      </div>
    );
    /* jshint ignore:end */
  },
  renderSignInForm: function(){
    var submitButtonText = this.state.loggingIn ? 'Logging in...' : 'Log in';

    /* jshint ignore:start */
    return (
      <form className='login-form'>
        <div className='login-form-group'>
          <input type='email' className='login-form-control' ref='emailField' id='email' placeholder='Email' />
        </div>
        <div className='login-form-group'>
          <input type='password' className='login-form-control' ref='pwField' id='password' placeholder='Password' />
        </div>
        <div className='login-form-group-checkbox'>
          <label htmlFor='remember'>
            <input type='checkbox' ref='rememberMe' id='remember' /> Remember me
          </label>
        </div>
        <div className='login-form-action-group'>
          <button type='submit' className='login-form-button' ref='loginBtn' onClick={this.handleLogin}>
            {submitButtonText}
          </button>
        </div>
      </form>
    );
    /* jshint ignore:end */
  },
  renderMessage: function() {
    var message = this.state.message;
    if (message) {
      return (
        /* jshint ignore:start */
        <div className='login-message login-message-error'>
          {message}
        </div>
        /* jshint ignore:end */
      );
    }
    return null;
  },

  render: function() {

    var login = this.renderSignInForm();
    var logos = this.renderLogos();
    var message = this.renderMessage();

    return (
       /* jshint ignore:start */
      <div className='login'>
        {logos}
        {login}
        {message}
      </div>
       /* jshint ignore:end */
      );
  },

  handleLogin: function(e) {

    if(e){
      e.preventDefault();
    }

    if (this.state.loggingIn) {
      return;
    }

    this.setState({loggingIn: true});

    var user = {
      username : this.refs.emailField.getDOMNode().value,
      password : this.refs.pwField.getDOMNode().value
    };

    var options = {
      remember : this.refs.rememberMe.state.checked
    };

    var validationError = this.validate(user);

    if (validationError) {
      this.setState({
        loggingIn: false,
        message: validationError
      });
      return;
    }

    this.props.login(user, options, function(err) {
      if (err) {

        var errorMessage = 'An error occured while logging in.';
        if (err.status === 401) {
          errorMessage = 'Wrong username or password.';
        }

        this.setState({
          loggingIn: false,
          message: errorMessage
        });
        return;
      }
      this.props.onLoginSuccess();
    }.bind(this));
  },

  validate: function(user) {
    if (!user.username && !user.password) {
      return 'Missing email and password.';
    }

    if (!user.username) {
      return 'Missing email.';
    }

    if (!user.password) {
      return 'Missing password.';
    }
  }
});

module.exports = Login;
