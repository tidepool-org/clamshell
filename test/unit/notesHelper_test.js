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

var notesHelper = require('../../src/core/notesHelper');
var teamData = require('../../demo/data').team;

describe('notesHelper', function() {

	var thread;
	var parentId = '9233c2ae-7bad-41f5-9295-e73f0437295b';

	before(function(){
		var teamHelper = require('../../src/core/teamHelper');
		thread = teamHelper.getThread(teamData,parentId);
	});

    it('getParentMessageId returns id of the parent message', function() {
        var foundParentId = notesHelper.getParentMessageId(thread);
        expect(foundParentId).to.equal(parentId);
    });

});