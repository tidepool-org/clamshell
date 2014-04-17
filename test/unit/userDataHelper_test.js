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

var userDataHelper = require('../../src/core/userDataHelper');

var loggedInUserData = require('../../demo/data').loggedInUser;
var team = loggedInUserData.teams[0];

describe('userDataHelper', function() {

  it('getParentMessageId returns id of the parent message', function() {
    var parentId = '9233c2ae-7bad-41f5-9295-e73f0437295b';
    var thread = userDataHelper.getThread(team, parentId);
    var foundParentId = userDataHelper.getParentMessageId(thread);
    expect(foundParentId).to.equal(parentId);
  });

  it('getThread returns notes in a thread', function() {
    var thread = userDataHelper.getThread(team,'9233c2ae-7bad-41f5-9295-e73f0437295b');
    expect(thread).to.exist;
    expect(thread).to.be.a('array');
    expect(thread.length).to.equal(4);
  });

  it('filterNotes returns only notes from thread', function() {
    var notes = userDataHelper.filterNotes(team.notes);
    expect(notes.length).to.equal(2);

    notes.forEach(function(note) {
      expect(note.parentmessage).to.not.exist;
    });

  });

  it('sortNotes returns oldest note first', function() {
    var notes = userDataHelper.sortNotes(team.notes);
    var firstNote = notes[0];
    expect(firstNote.timestamp).to.equal('2013-12-22T23:07:40+00:00');
  });

  it('getNotesForTeams returns all notes for all teams', function() {

    var expectedNotesCount = team.notes.length;

    var allNotes = userDataHelper.getNotesForTeams(loggedInUserData.teams);
    expect(allNotes.length).to.equal(expectedNotesCount);

  });

  it('formatFullNameFromProfile returns the firstName as a string from the profile', function() {

    var profile = {firstName:'Foo',lastName:null};
    expect(userDataHelper.formatFullNameFromProfile(profile)).to.equal('Foo');

  });

  it('formatFullNameFromProfile returns the first and last as a string from the profile', function() {

    var profile = {firstName:'Foo',lastName:'Bar'};
    expect(userDataHelper.formatFullNameFromProfile(profile)).to.equal('Foo Bar');

  });

  it('formatFullNameFromProfile returns nothing when profile not set', function() {

    var profile = {firstName:'',lastName:null};
    expect(userDataHelper.formatFullNameFromProfile(profile)).to.not.exist;

  });

  it('createMessage returns message that is for a specified group', function() {

    var userDetails = {
      userid : '12345678',
      profile : { firstName : 'Bob' }
    };

    var testMessage = 'whoomp there it is';
    var testGroupId = 'theId';

    var message = userDataHelper.createMessage(testMessage,userDetails,testGroupId);

    expect(message.userid).to.equal(userDetails.userid);
    expect(message.parentmessage).to.not.exist;
    expect(message.groupid).to.equal(testGroupId);
    expect(message.timestamp).to.exist;
    expect(message.messagetext).to.equal(testMessage);
  });

  it('createReply returns message that is for a specified group and parent message', function() {

    var userDetails = {
      userid : '12345678',
      profile : { firstName : 'Bob' }
    };

    var testReply = 'Tag Team in 1993';
    var testGroupId = 'theId';
    var parentMessageId = 'theParentMessage';

    var reply = userDataHelper.createMessage(testReply,userDetails,testGroupId, parentMessageId);

    expect(reply.userid).to.equal(userDetails.userid);
    expect(reply.parentmessage).to.equal(parentMessageId);
    expect(reply.groupid).to.equal(testGroupId);
    expect(reply.timestamp).to.exist;
    expect(reply.messagetext).to.equal(testReply);
  });

});