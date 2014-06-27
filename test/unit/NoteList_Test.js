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
var NoteList = require('../../src/components/notes/NoteList');

var notes = [
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
    id: '3',
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

describe('NoteList', function() {
  var component;
  var handleThreadSelected = sinon.spy();
  var handleSaveEdited = sinon.spy();

  beforeEach(function() {
    component = helpers.mountComponent(
      NoteList({
        notes: notes,
        loggedInId: '1', //As paul
        onThreadSelected : handleThreadSelected,
        onSaveEdited : handleSaveEdited
      })
    );
  });

  afterEach(function() {
    helpers.unmountComponent();
  });

  it('should call handler with parent message to show thread for', function() {
    component.refs.rootNote.props.onShowThread();
    expect(handleThreadSelected).to.have.been.calledWith(notes[0]);
  });
  it('should call handler to save the edits', function() {
    component.refs.rootNote.props.onSaveEdit();
    expect(handleSaveEdited).to.have.been.calledWith();
  });
  it('has method to renderNote', function() {
    expect(component.renderNote).to.exist;
  });
  it('has method to renderComment', function() {
    expect(component.renderComment).to.exist;
  });
  describe('thread notes', function() {
    it('are built by a method renderThread', function() {
      expect(component.renderThread).to.exist;
    });
    it('returns related notes', function() {
      var threadNoteComponents = component.renderThread();
      expect(threadNoteComponents.length).to.equal(3);
    });
  });
  describe('parent notes', function() {
    it('are built by a method renderParents', function() {
      expect(component.renderParents).to.exist;
    });
    it('returns parent notes', function() {
      var parentNotes = component.renderParents();
      console.log(parentNotes);
      parentNotes.forEach(function(note){
        if(note){
          expect(note.parentmessage).to.not.exist;
        }
      });
    });
  });
});
