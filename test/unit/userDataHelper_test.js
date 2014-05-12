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

var userDataHelper = require('../../src/core/userDataHelper');

describe('userDataHelper', function() {

  it('getParentMessageId returns parent message id of a thread', function() {
    var thread = [
      {id: '1', parentmessage: null},
      {id: '2', parentmessage: '1'},
      {id: '3', parentmessage: '1'}
    ];
    var foundParentId = userDataHelper.getParentMessageId(thread);
    expect(foundParentId).to.equal('1');
  });

  it('getThread returns messages belonging to a thread', function() {
    var team = {
      notes: [
        {id: '1', parentmessage: null},
        {id: '2', parentmessage: '1'},
        {id: '3', parentmessage: null}
      ]
    };
    var thread = userDataHelper.getThread(team,'1');
    expect(thread).to.exist;
    expect(thread).to.be.a('array');
    expect(thread.length).to.equal(2);
  });

  it('filterNotes returns only notes from a list of messages', function() {
    var messages = [
      {id: '1', parentmessage: null},
      {id: '2', parentmessage: '1'}
    ];
    var notes = userDataHelper.filterNotes(messages);
    expect(notes.length).to.equal(1);
  });

  it('sortNotesDescending returns newest note first', function() {
    var messages = [
      {timestamp: '2013-01-01T00:00:00+00:00'},
      {timestamp: '2014-01-01T00:00:00+00:00'}
    ];
    var notes = userDataHelper.sortNotesDescending(messages);
    var firstNote = notes[0];
    expect(firstNote.timestamp).to.equal('2014-01-01T00:00:00+00:00');
  });

  it('sortNotesAscending returns oldest note first', function() {
    var messages = [
      {timestamp: '2014-01-01T00:00:00+00:00'},
      {timestamp: '2013-01-01T00:00:00+00:00'}
    ];
    var notes = userDataHelper.sortNotesAscending(messages);
    var firstNote = notes[0];
    expect(firstNote.timestamp).to.equal('2013-01-01T00:00:00+00:00');
  });

  it('getNotesForTeams returns all notes for all teams', function() {
    var teams = [
      {notes: [{id: '1'}, {id: '2'}]},
      {notes: [{id: '3'}]}
    ];

    var allNotes = userDataHelper.getNotesForTeams(teams);
    expect(allNotes.length).to.equal(3);
  });

  it('formatFullName returns the fullName as a string from the profile', function() {
    var profile = {fullName:'Foo Bar'};
    expect(userDataHelper.formatFullName(profile)).to.equal('Foo Bar');
  });

  it('formatFullName returns nothing when profile not set', function() {
    var profile = {};
    expect(userDataHelper.formatFullName(profile)).to.not.exist;
  });

  it('formatShortName returns the shortName as a string from the profile', function() {
    var profile = {shortName:'Foo'};
    expect(userDataHelper.formatShortName(profile)).to.equal('Foo');
  });

  it('formatShortName returns nothing when shortName is not set', function() {
    var profile = {};
    expect(userDataHelper.formatShortName(profile)).to.not.exist;
  });

  it('getSelectedUser returns the logged in user when given proper userid', function() {
    var loggedInUser = {userid: '1'};
    expect(userDataHelper.getSelectedUser('1', loggedInUser)).to.deep.equal(loggedInUser);
  });

  it('getSelectedUser returns the team user when given proper userid', function() {
    var loggedInUser = {
      userid: '1',
      teams: [
        {userid: '2'}
      ]
    };
    expect(userDataHelper.getSelectedUser('2',loggedInUser)).to.deep.equal(loggedInUser.teams[0]);
  });

  it('getAllNotesForLoggedInUser returns team notes when user has no notes', function() {
    var loggedInUser = {
      notes: [],
      teams: [
        {notes: [{id: '1'}]},
        {notes: [{id: '2'}]}
      ]
    };
    expect(userDataHelper.getAllNotesForLoggedInUser(loggedInUser).length).to.equal(2);
  });

  it('getAllNotesForLoggedInUser returns user and team notes when both exist', function() {
    var loggedInUser = {
      notes: [{id: '1'}],
      teams: [
        {notes: [{id: '2'}]},
        {notes: [{id: '3'}]}
      ]
    };
    expect(userDataHelper.getAllNotesForLoggedInUser(loggedInUser).length).to.equal(3);
  });

  it('createMessage returns message that is for a specified group', function() {
    var userDetails = {
      userid : '12345678',
      profile : { fullName : 'Sponge Bob' }
    };

    var testMessage = 'whoomp there it is';
    var testGroupId = 'theId';

    var message = userDataHelper.createMessage(testMessage,userDetails,testGroupId);

    expect(message.userid).to.equal(userDetails.userid);
    expect(message.parentmessage).to.not.exist;
    expect(message.groupid).to.equal(testGroupId);
    expect(message.timestamp).to.exist;
    expect(message.user).to.equal(userDetails.profile);
    expect(message.messagetext).to.equal(testMessage);
  });

  it('createReply returns message that is for a specified group and parent message', function() {
    var userDetails = {
      userid : '12345678',
      profile : { fullName : 'Sponge Bob' }
    };

    var testReply = 'Tag Team in 1993';
    var testGroupId = 'theId';
    var parentMessageId = 'theParentMessage';

    var reply = userDataHelper.createMessage(testReply,userDetails,testGroupId, parentMessageId);

    expect(reply.userid).to.equal(userDetails.userid);
    expect(reply.parentmessage).to.equal(parentMessageId);
    expect(reply.user).to.equal(userDetails.profile);
    expect(reply.groupid).to.equal(testGroupId);
    expect(reply.timestamp).to.exist;
    expect(reply.messagetext).to.equal(testReply);
  });

});
