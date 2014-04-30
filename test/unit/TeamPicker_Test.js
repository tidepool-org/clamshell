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
var React = require('react');

var TeamPicker = require('../../build/components/header/TeamPicker');

var helpers = require('../lib/helpers');

var loggedInUserData = require('../../demo/data').loggedInUser;

var selectedUsersId;

var handleUserPicked = function(selectedId){
  selectedUsersId = selectedId;
};

describe('TeamPicker', function() {
  var component, container;

  beforeEach(function() {
    component = helpers.mountComponent(
     TeamPicker({loggedInUser:loggedInUserData, onUserPicked:handleUserPicked})
    );
  });

  afterEach(function() {
    helpers.unmountComponent();
  });

  it('should have a group drop down', function() {
    var groupDropdown = component.refs.selectGroup;
    expect(groupDropdown).to.exist;
  });

  it('should have a groups list', function() {
    var groupsList = component.refs.groups;
    expect(groupsList).to.exist;
  });

  it('should have a group to select', function() {
    var groupToSelect = component.refs.group;
    expect(groupToSelect).to.exist;
  });

  it('should have a teamColumn', function() {
    var teamColumn = component.refs.teamColumn;
    expect(teamColumn).to.exist;
  });

  it.skip('should fire the handler with the id of the choosen group', function() {
    component.refs.teamColumn.props.onClick();
    expect(selectedUsersId).to.exist;
  });

});