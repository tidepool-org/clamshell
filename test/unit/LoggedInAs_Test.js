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
var LoggedInAs = require('../../src/components/menu/LoggedInAs');

describe('LoggedInAs', function() {
  var component;

  beforeEach(function() {
    component = helpers.mountComponent(LoggedInAs());
  });

  afterEach(function() {
    helpers.unmountComponent();
  });

  it('should show user full name', function() {
    var expectedName = 'John Doe';
    var user = {profile: {fullName: expectedName}};

    component.setProps({user: user});
    var actualName = component.refs.name.props.children;

    expect(actualName).to.equal(expectedName);
  });

  it('should call handler when logout clicked', function() {
    var handleLogout = sinon.spy();

    component.setProps({
      onLogout: handleLogout
    });
    var clickLogout = component.refs.logout.props.onClick;
    clickLogout();

    expect(handleLogout).to.have.been.called;
  });
});
