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
var _ = require('lodash');

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
    expect(notes.length).to.equal(3);

    notes.forEach(function(note) {
      expect(note.parentmessage).to.not.exist;
    });

  });

  it('sortNotesDescending returns newest note first', function() {
    var notes = userDataHelper.sortNotesDescending(team.notes);
    var firstNote = notes[0];
    expect(firstNote.timestamp).to.equal('2014-01-08T23:07:40+00:00');
  });

  it('sortNotesAscending returns oldest note first', function() {
    var notes = userDataHelper.sortNotesAscending(team.notes);
    var firstNote = notes[0];
    expect(firstNote.timestamp).to.equal('2013-12-22T23:07:40+00:00');
  });

  it('getNotesForTeams returns all notes for all teams', function() {

    var expectedNotesCount = team.notes.length;

    var allNotes = userDataHelper.getNotesForTeams(loggedInUserData.teams);
    expect(allNotes.length).to.equal(expectedNotesCount);

  });

  it('formatFullName returns the firstName as a string from the profile', function() {

    var profile = {firstName:'Foo',lastName:null};
    expect(userDataHelper.formatFullName(profile)).to.equal('Foo');

  });

  it('formatFullName returns the first and last as a string from the profile', function() {

    var profile = {firstName:'Foo',lastName:'Bar'};
    expect(userDataHelper.formatFullName(profile)).to.equal('Foo Bar');

  });

  it('formatFullName returns nothing when profile not set', function() {

    var profile = {firstName:'',lastName:null};
    expect(userDataHelper.formatFullName(profile)).to.not.exist;

  });

  it('formatShortName returns the first name as a string from the profile', function() {

    var profile = {firstName:'Foo',lastName:'Bar'};
    expect(userDataHelper.formatShortName(profile)).to.equal('Foo');

  });

  it('formatShortName returns nothing when the firstName is not set', function() {

    var profile = {firstName:'',lastName:'Bar'};
    expect(userDataHelper.formatShortName(profile)).to.not.exist;

  });
  //getSelectedUser
  it('getSelectedUser returns the logged in user when given that userid', function() {
    expect(userDataHelper.getSelectedUser(loggedInUserData.userid,loggedInUserData)).to.deep.equal(loggedInUserData);
  });

  it('getSelectedUser returns the team user when given that userid', function() {
    expect(userDataHelper.getSelectedUser(team.userid,loggedInUserData)).to.deep.equal(team);
  });

  it('getAllNotesForLoggedInUser returns 6 notes', function() {
    expect(userDataHelper.getAllNotesForLoggedInUser(loggedInUserData).length).to.equal(6);
  });

  it('getAllNotesForLoggedInUser returns 7 notes when we add one for the user', function() {
    loggedInUserData.notes.push(team.notes[3]);
    expect(userDataHelper.getAllNotesForLoggedInUser(loggedInUserData).length).to.equal(7);
  });

  it('hasTeams should be true for a user with .teams[]', function() {
    expect(userDataHelper.hasTeams(loggedInUserData)).to.be.true;
  });

  it('hasTeams should be false for a user with no teams', function() {
    var loggedInUserWithNoTeams = _.clone(loggedInUserData, true);
    loggedInUserWithNoTeams.teams = null;
    expect(userDataHelper.hasTeams(loggedInUserWithNoTeams)).to.be.false;
  });

  it('hasMultipleSelectableTeams should be false when the loggedInUser is NOT a person with data', function() {
    expect(userDataHelper.hasMultipleSelectableTeams(loggedInUserData)).to.be.false;
  });

  it('hasMultipleSelectableTeams should be true when the loggedInUser is a person with data', function() {
    var loggedInUserWithOwnData = _.clone(loggedInUserData, true);
    loggedInUserWithOwnData.isPWD = true;
    expect(userDataHelper.hasMultipleSelectableTeams(loggedInUserWithOwnData)).to.be.true;
  });

  it('getInitialSelectedUser returns the logged if they are a person with data', function() {
    var loggedInUserWithOwnData = _.clone(loggedInUserData, true);
    loggedInUserWithOwnData.isPWD = true;
    expect(userDataHelper.getUserWithData(loggedInUserWithOwnData)).to.deep.equal(loggedInUserWithOwnData);
  });

  it('getInitialSelectedUser returns the fist person with data from the looged in users teams', function() {
    expect(userDataHelper.getUserWithData(loggedInUserData)).to.deep.equal(team);
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
    expect(message.user).to.equal(userDetails.profile);
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
    expect(reply.user).to.equal(userDetails.profile);
    expect(reply.groupid).to.equal(testGroupId);
    expect(reply.timestamp).to.exist;
    expect(reply.messagetext).to.equal(testReply);
  });

});