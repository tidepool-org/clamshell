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

var helpers = require('../lib/helpers');
var Login = require('../../src/components/login/Login');

describe('Login', function() {
  var component;

  beforeEach(function() {
    component = helpers.mountComponent(Login());
  });

  afterEach(function() {
    helpers.unmountComponent();
  });

  it('should have a login button of type submit', function() {
    var loginBtn = component.refs.loginBtn;
    expect(loginBtn).to.exist;
    expect(loginBtn.props.type).to.equal('submit');
  });

  it('should have an input of type email', function() {
    var email = component.refs.emailField;
    expect(email).to.exist;
    expect(email.props.type).to.equal('email');
  });

  it('should have an input of type password', function() {
    var pw = component.refs.pwField;
    expect(pw).to.exist;
    expect(pw.props.type).to.equal('password');
  });

  it('should have a remember-me input of type checkbox', function() {
    var rememberMe = component.refs.rememberMe;
    expect(rememberMe).to.exist;
    expect(rememberMe.props.type).to.equal('checkbox');
  });

  it('should have remember-me set as false by default', function() {
    var rememberMe = component.refs.rememberMe;
    expect(rememberMe.state.checked).to.be.false;
  });

  it('should call login handler with field values when submit clicked', function() {
    var fakeUn = 'fake.user@go.org';
    var fakePw = 'f@k31t';

    var user = {
      username : fakeUn,
      password : fakePw
    };

    var handleLogin = sinon.spy();
    component.setProps({
      login: handleLogin,
      onLoginSuccess: function() {}
    });

    component.refs.emailField.getDOMNode().value = fakeUn;
    component.refs.pwField.getDOMNode().value = fakePw;
    var clickLogin = component.refs.loginBtn.props.onClick;
    clickLogin();

    expect(handleLogin).to.have.been.calledWith(user);
  });

  it('should fire login success handler when login complete', function(done) {
    var handleLoginSuccess = sinon.spy();
    var handleLogin = function(user, options, cb) {
      cb();
      expect(handleLoginSuccess).to.have.been.called;
      done();
    };

    component.setProps({
      login: handleLogin,
      onLoginSuccess: handleLoginSuccess
    });
    component.refs.emailField.getDOMNode().value = 'foo';
    component.refs.pwField.getDOMNode().value = 'bar';
    var clickLogin = component.refs.loginBtn.props.onClick;
    clickLogin();
  });

  it('should fail validation and return a message with no email', function() {
    var user = {
      username : '',
      password : 'pa55w0rd'
    };

    var err = component.validate(user);
    expect(err).to.equal('Missing email.');
  });

  it('should fail validation and return a message with no pw', function() {

    var user = {
      username : 'test.user@test.com',
      password : ''
    };

    var err = component.validate(user);
    expect(err).to.equal('Missing password.');
  });

  it('should fail validation and return a message with no pw and email', function() {
    var user = {
      username : '',
      password : ''
    };

    var err = component.validate(user);
    expect(err).to.equal('Missing email and password.');
  });

  it('should pass validation when given required inputs', function() {
    var user = {
      username : 'test.user@test.com',
      password : 'pa55w0rd'
    };

    var err = component.validate(user);
    expect(err).to.be.empty;
  });
});
