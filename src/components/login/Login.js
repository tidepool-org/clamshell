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

var Login = React.createClass({

  getInitialState: function() {
    return {
      loggingIn: false,
      message: ''
    };
  },

  renderSignInForm: function(){
    return (
      /* jshint ignore:start */
      <form className='login-form form-horizontal' role='form'>
        <div className='form-group'>
          <div className='col-sm-3'>
            <input type='email' ref='emailFeild' id='inputEmail3' className='form-control' placeholder='Email' />
          </div>
        </div>
        <div className='form-group'>
          <div className='col-sm-3'>
            <input type='password' ref='pwFeild' className='form-control' id='inputPassword3' placeholder='Password' />
          </div>
        </div>
        <div className='form-group'>
          <div className='col-sm-offset-2 col-sm-3'>
            <a type='submit' className='btn btn-default' ref='loginBtn' onClick={this.handleLogin}>Sign in</a>
          </div>
        </div>
      </form>
      /* jshint ignore:end */
      );
  },
  renderMessage: function() {
    var message = this.state.message;
    if (message) {

      return (
         /* jshint ignore:start */
          <div className='login-message col-sm-offset-2 col-sm-3 js-login-message'>
            {message}
          </div>

      /* jshint ignore:end */
        );
    }
    return null;
  },

  render: function() {

    var login = this.renderSignInForm();
    var message = this.renderMessage();

    return (
       /* jshint ignore:start */
      <div className='login content'>
      {login}
      {message}
      </div>
       /* jshint ignore:end */
      );
  },

  handleLogin: function() {
    var self = this;

    if (this.state.loggingIn) {
      return;
    }

    this.setState({loggingIn: true});

    var username = this.refs.emailFeild.getDOMNode().value;
    var password = this.refs.pwFeild.getDOMNode().value;

    var validationError = this.validate(username, password);
    if (validationError) {
      this.setState({
        loggingIn: false,
        message: validationError
      });
      return;
    }

    this.props.login(username, password, function(err) {
      if (err) {
        self.setState({
          loggingIn: false,
          message: err.message || 'An error occured while logging in.'
        });
        return;
      }
      self.setState({loggingIn: false});
      self.props.onLoginSuccess();
    });
  },

  validate: function(username, password) {
    if (!username && !password) {
      return 'Missing email and password.';
    }

    if (!username) {
      return 'Missing email.';
    }

    if (!password) {
      return 'Missing password.';
    }
  }
});

module.exports = Login;