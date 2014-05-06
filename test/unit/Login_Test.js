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

var chai = require('chai');
var expect = chai.expect;

var Login = require('../../build/components/login/Login');

var helpers = require('../lib/helpers');

var loggedIn = false;

var handleLoginSuccess  = function(){
  loggedIn = true;
};

var loginFake  = function(user,cb){
  cb(user.username,user.password);
};

describe('Login', function() {
  var component;

  beforeEach(function() {
    component = helpers.mountComponent(
      Login({
        login : loginFake,
        onLoginSuccess : handleLoginSuccess
      })
    );
  });

  afterEach(function() {
    helpers.unmountComponent();
  });

  it('should have a login button of type submit', function() {
    var loginBtn = component.refs.loginBtn;
    expect(loginBtn).to.exist;
    console.log(loginBtn);
    expect(loginBtn.props.type).to.equal('submit');
  });

  it('takes a users email and is of type email', function() {
    var email = component.refs.emailField;
    expect(email).to.exist;
    expect(email.props.type).to.equal('email');
  });

  it('takes a users password and is of type password', function() {
    var pw = component.refs.pwField;
    expect(pw).to.exist;
    expect(pw.props.type).to.equal('password');
  });

  it('allows to select a remember me which is a checkbox', function() {
    var rememberMe = component.refs.rememberMe;
    expect(rememberMe).to.exist;
    expect(rememberMe.props.type).to.equal('checkbox');
  });

  it('remember me is false by default', function() {
    var rememberMe = component.refs.rememberMe;
    expect(rememberMe.state.checked).to.be.false;
  });

  it('should fire onLoginSuccess handler when called', function() {
    expect(loggedIn).to.be.false;
    component.props.onLoginSuccess();
    expect(loggedIn).to.be.true;
  });

  it('should use login handler when submit clicked', function() {


    var fakeUn = 'fake.user@go.org';
    var fakePw = 'f@k31t';

    var user = {
      username : fakeUn,
      password : fakePw
    };

    component.props.login(user,function(givenUser,givenPw){
      expect(givenPw).to.equal(fakePw);
      expect(givenUser).to.equal(fakeUn);
    });
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

  it('should pass validation when given details', function() {
    var user = {
      username : 'test.user@test.com',
      password : 'pa55w0rd'
    };

    var err = component.validate(user);
    expect(err).to.be.empty;
  });

  it('should have a loggingIn state', function() {
    var loggingInState = component.state.loggingIn;
    expect(loggingInState).to.exist;
  });

  it('should have a message in state', function() {
    var messageState = component.state.message;
    expect(messageState).to.exist;
  });

});
