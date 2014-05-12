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
var Layout = require('../../src/layout/Layout');

describe('Layout', function() {
  var component;

  beforeEach(function() {
    component = helpers.mountComponent(Layout({}, 'my content'));
  });

  afterEach(function() {
    helpers.unmountComponent();
  });

  it('should render content given as children', function() {
    var content = component.refs.content.props.children;

    expect(content).to.equal('my content');
  });

  it('should not render other regions if only given content', function() {
    var notification = component.refs.notification;
    var header = component.refs.header;
    var menu = component.refs.menu;
    var footer = component.refs.footer;

    expect(notification).to.not.exist;
    expect(header).to.not.exist;
    expect(menu).to.not.exist;
    expect(footer).to.not.exist;
  });

  it('should render notification', function() {
    var expectedNotification = 'my notification';

    component.setProps({notification: expectedNotification});
    var actualNotification = component.refs.notification.props.children;

    expect(actualNotification).to.equal(expectedNotification);
  });

  it('should render header', function() {
    var expectedHeader = 'my header';

    component.setProps({header: expectedHeader});
    var actualHeader = component.refs.header.props.children;

    expect(actualHeader).to.equal(expectedHeader);
  });

  it('should render menu', function() {
    var expectedMenu = 'my menu';

    component.setProps({menu: expectedMenu});
    var actualMenu = component.refs.menu.props.children;

    expect(actualMenu).to.equal(expectedMenu);
  });

  it('should render footer', function() {
    var expectedFooter = 'my footer';

    component.setProps({footer: expectedFooter});
    var actualFooter = component.refs.footer.props.children;

    expect(actualFooter).to.equal(expectedFooter);
  });

  it('should add has-header class to elements when given a header', function() {
    component.setProps({
      header: 'my header',
      menu: 'my menu'
    });
    var contentClasses = component.refs.contentContainer.props.className;
    var menuClasses = component.refs.menuContainer.props.className;

    expect(contentClasses).to.contain('has-header');
    expect(menuClasses).to.contain('has-header');
  });

  it('should add has-footer class to elements when given a footer', function() {
    component.setProps({
      footer: 'my footer',
      menu: 'my menu'
    });
    var contentClasses = component.refs.contentContainer.props.className;
    var menuClasses = component.refs.menuContainer.props.className;

    expect(contentClasses).to.contain('has-footer');
    expect(menuClasses).to.contain('has-footer');
  });
});
