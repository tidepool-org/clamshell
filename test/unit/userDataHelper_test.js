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

var chai = require('chai');
var expect = chai.expect;

var userDataHelper = require('../../src/core/userDataHelper');
var teamData = require('../../demo/data');
var team = teamData.team;
var patients = teamData.patients;

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

    it('getTeam returns team with the given id', function() {

    	var groupToFind = '07abb942-5c77-4c87-aa94-12c08b805d7f';

    	var groups = patients;
    	groups.push(team);

        var foundTeam = userDataHelper.getTeam(groups,groupToFind);
        expect(foundTeam).to.exist;
        expect(foundTeam.id).to.equal(groupToFind);
    });

});