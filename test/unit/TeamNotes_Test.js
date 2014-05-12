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
var TeamNotes = require('../../src/components/notes/TeamNotes');

var teamNotes = [
  {
    id: '1',
    parentmessage: null,
    userid: '1',
    groupid: '2',
    user: {fullName: 'Paul Senter'},
    team: {fullName: 'Anne Senter'},
    timestamp: '2014-03-24T16:00:00+00:00',
    messagetext: 'Hello'
  },
  {
    id: '1',
    parentmessage: '1',
    userid: '1',
    groupid: '2',
    user: {fullName: 'Melissa Senter'},
    team: {fullName: 'Anne Senter'},
    timestamp: '2014-03-24T16:00:00+00:00',
    messagetext: 'Foo'
  },
  {
    id: '2',
    parentmessage: null,
    userid: '3',
    groupid: '2',
    user: {fullName: 'Paul Senter'},
    team: {fullName: 'Anne Senter'},
    timestamp: '2014-03-24T18:00:00+00:00',
    messagetext: 'Hi'
  }
];

describe('TeamNotes', function() {
  var component;

  beforeEach(function() {
    component = helpers.mountComponent(
      TeamNotes({
        notes: teamNotes,
        onThreadSelected: function() {}
      })
    );
  });

  afterEach(function() {
    helpers.unmountComponent();
  });

  it('should call handler with message when an item is clicked', function() {
    var handleThreadSelected = sinon.spy();
    component.setProps({onThreadSelected: handleThreadSelected});

    // select the first item that is a child of our component
    component.refs.teamNote.props.onNoteSelected();

    expect(handleThreadSelected).to.have.been.calledWith(teamNotes[0]);
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
