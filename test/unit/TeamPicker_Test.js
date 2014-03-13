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

var team = require('../../demo/data').team;

var selectedGroupId;

var handleGroupPicked = function(content){
  selectedGroupId = content.groupId;
};

describe('TeamPicker', function() {
  var component, container;

  beforeEach(function() {
    //we add our component to test into a div and then render it
    component = new TeamPicker({groups:[team], onGroupPicked:handleGroupPicked});
    container = document.createElement('div');
    document.documentElement.appendChild(container);
    React.renderComponent(component, container);
  });

  afterEach(function() {
    React.unmountComponentAtNode(container);
    document.documentElement.removeChild(container);
  });

  it('should have a group drop down', function() {
    var groupDropdown = component.refs.groupDropdown;
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

  it('should fire the handler with the id of the choosen group', function() {
    component.refs.groupSelect.props.onClick();
    expect(selectedGroupId).to.exist;
  });

});