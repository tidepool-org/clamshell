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

var TeamNotes = require('../../build/components/notes/TeamNotes');

var helpers = require('../lib/helpers');

var loggedInUserData = require('../../demo/data').loggedInUser;
var teamNotes = loggedInUserData.teams[0].notes;

var handlerCalled = false;
var propsGiven;

var handleThreadSelected = function(props, key){
  propsGiven = props;
  handlerCalled = true;
};

describe('TeamNotes component', function() {
  var component;

  beforeEach(function() {
    component = helpers.mountComponent(
     TeamNotes({notes:teamNotes,onThreadSelected:handleThreadSelected})
    );
  });

  afterEach(function() {
    helpers.unmountComponent();
  });

  it.skip('should call handler for group selection when a note is clicked', function() {
    //call the onClick of first groupitem that is a child of our component
    console.log('failing test');
    component.refs.teamNote.props.onClick();
    expect(handlerCalled).to.be.true;
  });

  it.skip('should return the note when it is clicked', function() {
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
