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

var TeamNotes = require('../../build/components/notes/TeamNotes');

var loggedInUserData = require('../../demo/data').loggedInUser;

var handlerCalled = false;
var propsGiven;

var handleThreadSelected = function(props, key){
  propsGiven = props;
  handlerCalled = true;
};

describe('TeamNotes component', function() {
  var component, container;

  beforeEach(function() {
    //we add our component to test into a div and then render it
    component = new TeamNotes({loggedInUser:loggedInUserData,onThreadSelected:handleThreadSelected});

    container = document.createElement('div');
    document.documentElement.appendChild(container);
    React.renderComponent(component, container);

  });

  afterEach(function() {
    React.unmountComponentAtNode(container);
    document.documentElement.removeChild(container);
  });

  it('should call handler for group selection when a note is clicked', function() {
    //call the onClick of first groupitem that is a child of our component
    component.refs.teamNote.props.onClick();
    expect(handlerCalled).to.be.true;
  });

  it('should return the note when it is clicked', function() {
    //call the onClick of first groupitem that is a child of our component
    component.refs.teamNote.props.onClick();
    expect(propsGiven).to.have.id;
    expect(propsGiven).to.have.messagetext;
    expect(propsGiven).to.have.groupid;
    expect(propsGiven).to.have.userid;
    expect(propsGiven).to.have.timestamp;
  });

  it('has method to buildViewableNotes', function() {
    expect(component.buildViewableNotes).to.exist;
  });

  it('has method to prepareNotes', function() {
    expect(component.prepareNotes).to.exist;
  });

  it('prepareNotes will return all the notes, but not the comments, to be displayed', function() {
    var notes = component.prepareNotes();
    expect(notes).to.exist;
    expect(notes.length).to.equal(2);
  });

});