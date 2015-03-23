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
