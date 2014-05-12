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
var Header = require('../../src/components/header/Header');

describe('Header', function() {
  var component;

  beforeEach(function() {
    component = helpers.mountComponent(Header());
  });

  afterEach(function() {
    helpers.unmountComponent();
  });

  it('should show correct title', function() {
    var expectedTitle = 'foo';

    component.setProps({title: expectedTitle});
    var actualTitle = component.refs.title.props.children;

    expect(actualTitle).to.equal(expectedTitle);
  });

  it('should add correct icon classes', function() {
    component.setProps({
      leftIcon: 'up',
      rightIcon: 'down'
    });
    var leftIconClasses = component.refs.leftIcon.props.className;
    var rightIconClasses = component.refs.rightIcon.props.className;

    expect(leftIconClasses).to.contain('header-icon-up');
    expect(rightIconClasses).to.contain('header-icon-down');
  });

  it('should not show icon if none given', function() {
    var leftIcon = component.refs.leftIcon;
    var rightIcon = component.refs.rightIcon;

    expect(leftIcon).to.not.exist;
    expect(rightIcon).to.not.exist;
  });

  it('should add action link if given a handler', function() {
    component.setProps({
      onLeftAction: function() {},
      onRightAction: function() {}
    });
    var leftLink = component.refs.leftLink;
    var rightLink = component.refs.rightLink;

    expect(leftLink).to.exist;
    expect(rightLink).to.exist;
  });

  it('should not add action link if no handler given', function() {
    var leftLink = component.refs.leftLink;
    var rightLink = component.refs.rightLink;

    expect(leftLink).to.not.exist;
    expect(rightLink).to.not.exist;
  });
});
