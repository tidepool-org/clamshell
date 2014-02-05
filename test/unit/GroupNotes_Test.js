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

var GroupNotes = require('../../build/components/GroupNotes');
var groups = require('../../demo/data').groups;

var handlerCalled = false;
var propsGiven;

var handleThreadSelected = function(props, key){
  console.log('props: ',props);
  console.log('key: ',key);
  propsGiven = props;
  handlerCalled = true;
};

describe('GroupNotes', function() {
  var component, container;

  beforeEach(function() {
    //we add our component to test into a div and then render it
    component = new GroupNotes({groups:groups,onThreadSelected:handleThreadSelected});

    container = document.createElement('div');
    document.documentElement.appendChild(container);
    React.renderComponent(component, container);

  });

  afterEach(function() {
    React.unmountComponentAtNode(container);
    document.documentElement.removeChild(container);
  });

  it('should have method to get a nice time for display from the timestamp', function() {
    expect(component.niceTime).to.exist;
  });

  it('should have return the date to be displayed', function() {
    var dateString = '2013-12-24T23:07:40+00:00';
    var dateToDisplay = component.niceTime(dateString);
    expect(dateToDisplay).to.equal(dateString);
  });

  it('should call handler for group selection when a note is clicked', function() {
    //call the onClick of first groupitem that is a child of our component
    component.refs.groupNote.props.onClick();
    expect(handlerCalled).to.be.true;
  });

  it('should return the note when it is clicked', function() {
    //call the onClick of first groupitem that is a child of our component
    component.refs.groupNote.props.onClick();
    expect(propsGiven).to.have.id;
    expect(propsGiven).to.have.messagetext;
    expect(propsGiven).to.have.groupid;
    expect(propsGiven).to.have.rootmessageid;
    expect(propsGiven).to.have.userid;
    expect(propsGiven).to.have.timestamp;
  });

  it('should return two notes', function() {
    //two notes but also replies/comments to those notes
    var group = groups[0];
    var converstions = component.notesForGroup(group);
    expect(converstions.length).to.equal(2);
  });

  it('should return all messages when there are no replies', function() {
    //added test as all messages are root 'notes' with no replies
    var group = groups[1];
    var converstions = component.notesForGroup(group);
    expect(converstions.length).to.equal(3);
  });

  it('should have two notes where the key is the id for the root message of each thread', function() {
    //call the onClick of first groupitem that is a child of our component
    var group = groups[0];
    var converstions = component.notesForGroup(group);

    expect(converstions[0].props.key).to.equal('9233c2ae-7bad-41f5-9295-e73f0437295b');
    expect(converstions[1].props.key).to.equal('070159bf-bd33-4998-b874-6b9c2bafe7fb');

  });

});