/**
 * Copyright (c) 2014, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

'use strict';

var helpers = require('../lib/helpers');
var Notification = require('../../src/components/notification/Notification');

describe('Notification', function() {
  var component;
  var handleClose = sinon.spy();

  beforeEach(function() {
    component = helpers.mountComponent(
      Notification({
        notification: {info : { type: 'error', message: 'hello', details : 'some details'}},
        onClose: handleClose
      })
    );
  });

  afterEach(function() {
    helpers.unmountComponent();
  });

  it('should show message', function() {
    var message = component.refs.message.props.children;

    expect(message).to.equal('hello');
  });

  it('should add correct notification type class', function() {
    var notificationClasses = component.refs.notification.props.className;

    expect(notificationClasses).to.contain('notification-error');
  });

  it('should call handler when close link is clicked', function() {
    component.refs.close.props.onClick();

    expect(handleClose).to.have.been.called;
  });

  it('should not show close link if no handler given', function() {
    component.setProps({
      onClose: null
    });

    expect(component.refs.close).to.not.exist;
  });
});
