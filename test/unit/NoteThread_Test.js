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

var NoteThread = require('../../build/components/notes/NoteThread');

var helpers = require('../lib/helpers');

var loggedInUserData = require('../../demo/data').loggedInUser;
var notes = loggedInUserData.teams[0].notes;

describe('NoteThread component', function() {
  var component;

  beforeEach(function() {
    component = helpers.mountComponent(
     NoteThread({messages:notes})
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

  it('the messageThread will have has many items as there are messages', function() {

    var numMessageThreadItems = component.refs.messageThread.props.children.length;
    var numOfMessages = component.props.messages.length;

    expect(numMessageThreadItems).to.equal(numOfMessages);
  });

  it('message will have a rootNote', function() {
    expect(component.refs.rootNote).to.exist;
  });

  it('message will have a commentNote', function() {
    expect(component.refs.commentNote).to.exist;
  });

});
