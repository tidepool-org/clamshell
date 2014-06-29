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

  it('formatTeamFullName returns the profile fullName if patient is user', function() {
    var profile = {fullName:'Foo Bar'};
    expect(userDataHelper.formatTeamFullName(profile)).to.equal('Foo Bar');
  });

  it('formatTeamFullName returns the patient fullName if patient is another person', function() {
    var profile = {fullName:'Foo Bar', patient: {isOtherPerson: true, fullName: 'Bob'}};
    expect(userDataHelper.formatTeamFullName(profile)).to.equal('Bob');
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
    var theUser = {
      userid : '12345678',
      profile : { fullName : 'Sponge Bob' }
    };

    var theMessage = 'whoomp there it is';
    var theGroupId = 'theId';
    var theTimestamp = new Date().toISOString();

    var message = userDataHelper.createMessage(theMessage, theTimestamp, theUser, theGroupId);

    expect(message.userid).to.equal(theUser.userid);
    expect(message.parentmessage).to.not.exist;
    expect(message.groupid).to.equal(theGroupId);
    expect(message.timestamp).to.equal(theTimestamp);
    expect(message.user).to.equal(theUser.profile);
    expect(message.messagetext).to.equal(theMessage);
  });

  it('createReply returns message that is for a specified group and parent message', function() {
    var theUser = {
      userid : '12345678',
      profile : { fullName : 'Sponge Bob' }
    };

    var theReply = 'Tag Team in 1993';
    var theGroupId = 'theId';
    var theParent = 'theParentMessage';
    var theTimestamp = new Date().toISOString();

    var reply = userDataHelper.createMessage(theReply, theTimestamp, theUser, theGroupId, theParent);

    expect(reply.userid).to.equal(theUser.userid);
    expect(reply.parentmessage).to.equal(theParent);
    expect(reply.user).to.equal(theUser.profile);
    expect(reply.groupid).to.equal(theGroupId);
    expect(reply.timestamp).to.equal(theTimestamp);
    expect(reply.messagetext).to.equal(theReply);
  });

});
