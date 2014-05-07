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

var Layout = require('../../build/layout/Layout');

var helpers = require('../lib/helpers');

var dismissed = false;

var handleDismiss  = function(){
  dismissed = true;
};

describe('Layout', function() {

  afterEach(function() {
    helpers.unmountComponent();
  });

  it('can be empty', function() {
    var emptyLayout = helpers.mountComponent(Layout());
    expect(emptyLayout).to.exist;
  });

  it('can be empty create with a notification', function() {
    var notificationLayout = helpers.mountComponent(Layout({notification:{message:'testing 123',type:'info'}}));
    expect(notificationLayout).to.exist;
  });

  it('can be empty create with a notification and onDismissNotification', function() {
    var notificationLayoutWithDismiss = helpers.mountComponent(
      Layout({
        notification : {message:'testing 123',type:'info'},
        onDismissNotification : handleDismiss
      }));
    expect(notificationLayoutWithDismiss).to.exist;
  });

  it('will have a dismiss button if the handler is set', function() {
    var notificationLayoutWithDismiss = helpers.mountComponent(
      Layout({
        notification : {message:'testing 123',type:'info'},
        onDismissNotification : handleDismiss
      }));

    var dismissBtn = notificationLayoutWithDismiss.getDismissButton();

    expect(dismissBtn).to.exist;
    expect(dismissBtn.props.type).to.equal('button');
  });

  it('will NOT have a dismiss button if the handler is NOT set', function() {
    var notificationLayoutNoDismiss = helpers.mountComponent(
      Layout({
        notification : {message:'testing 123',type:'info'}
      }));

    var dismissBtn = notificationLayoutNoDismiss.getDismissButton();

    expect(dismissBtn).to.not.exist;
  });

  it('will set the notification classes to be of the notification type given', function() {
    var notificationLayoutNoDismiss = helpers.mountComponent(
      Layout({
        notification : {message:'testing 123',type:'info'}
      }));

    var classes = notificationLayoutNoDismiss.getNotificationClasses();

    expect(classes).to.contain('layout-notification-info');
  });

  it('will defauilt the notification classes to alert if none is set', function() {
    var notificationLayoutNoDismiss = helpers.mountComponent(
      Layout({
        notification : {message:'testing 123',type:''}
      }));

    var classes = notificationLayoutNoDismiss.getNotificationClasses();

    expect(classes).to.contain('layout-notification-alert');
  });

  it('has no notification classes if a notification is not set', function() {
    var emptyLayout = helpers.mountComponent(Layout());

    var classes = emptyLayout.getNotificationClasses();

    expect(classes).to.not.exist;
  });

});
