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
var NoteThread = require('../../src/components/notes/NoteThread');

var messages = [
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
    id: '2',
    parentmessage: '1',
    userid: '3',
    groupid: '2',
    user: {fullName: 'Melissa Senter'},
    team: {fullName: 'Anne Senter'},
    timestamp: '2014-03-24T17:00:00+00:00',
    messagetext: 'Foo'
  }
];

describe('NoteThread', function() {
  var component;

  beforeEach(function() {
    component = helpers.mountComponent(
     NoteThread({messages: messages})
    );
  });

  afterEach(function() {
    helpers.unmountComponent();
  });

  it('should have messages', function() {
    expect(component.props.messages).to.exist;
  });

  it('should have a messageThread', function() {
    expect(component.refs.messageThread).to.exist;
  });

  it('should have as many items as there are messages', function() {
    var numMessageThreadItems = component.refs.messageThread.props.children.length;
    var numOfMessages = messages.length;

    expect(numMessageThreadItems).to.equal(numOfMessages);
  });

  it('should have a root note', function() {
    expect(component.refs.rootNote).to.exist;
  });

  it('should have a comment note', function() {
    expect(component.refs.commentNote).to.exist;
  });
});
