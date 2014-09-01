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

var _ = require('lodash');

// Users
// ====================================

var userCount = 0;

function nextUserId() {
	userCount = userCount + 1;
	return userCount.toString();
}

var users = {
	'Paul': {
		userid: nextUserId(),
		profile: {
			fullName: 'Paul Senter',
			patient: {isOtherPerson: true, fullName: 'Anne Senter'}
		}
	},
	'Melissa': {
		userid: nextUserId(),
		profile: {fullName: 'Melissa Senter'}
	},
	'Dr. Jona': {
		userid: nextUserId(),
		profile: {fullName: 'Dr. Jona'}
	},
	'Charles': {
		userid: nextUserId(),
		profile: {fullName: 'Charles West'}
	}
};

// Messages
// ====================================

var messageCount = 0;

function nextMessageId() {
	messageCount = messageCount + 1;
	return messageCount.toString();
}

var messages = {};
var note;
var comments;

function newMessage(opts) {
	var from = users[opts.from];
	var to = users[opts.to];
	return {
		id: nextMessageId(),
		parentmessage: opts.parentmessage || null,
		userid: from.userid,
		groupid: to.userid,
		user: _.clone(from.profile),
		team: _.clone(to.profile),
		timestamp: opts.timestamp,
		createdtime : opts.timestamp,
		messagetext: opts.messagetext
	};
}

// Anne
// ====================================

messages['Paul'] = [];

note = newMessage({
	from: 'Paul',
	to: 'Paul',
	timestamp: '2014-03-24T16:07:00+00:00',
	messagetext: 'Going to soccer game, 25% temp basal one hour early.'
});

comments = [
	newMessage({
		parentmessage: note.id,
		from: 'Melissa',
		to: 'Paul',
		timestamp: '2014-03-24T16:15:00+00:00',
		createdtime: '2014-03-24T16:15:00+00:00',
		messagetext: 'We tried that last week and she still went hight. Let\'s try 40%?'
	}),
	newMessage({
		parentmessage: note.id,
		from: 'Paul',
		to: 'Paul',
		timestamp: '2014-03-24T16:22:00+00:00',
		createdtime: '2014-03-24T16:22:00+00:00',
		messagetext: 'Okay, good idea. -40% set, 45 minutes till game time.'
	}),
	newMessage({
		parentmessage: note.id,
		from: 'Paul',
		to: 'Paul',
		timestamp: '2014-03-24T18:45:00+00:00',
		createdtime: '2014-03-24T18:45:00+00:00',
		messagetext: 'She peaked at 190 on CGM but was down to 112 at end of game. Won the game too!'
	})
];

messages['Paul'] = messages['Paul'].concat([note]).concat(comments);

note = newMessage({
	from: 'Melissa',
	to: 'Paul',
	timestamp: '2014-02-15T10:12:00+00:00',
	createdtime: '2014-02-15T10:12:00+00:00',
	messagetext: 'Soy flour, almond meal, eggs, sour cream and Splenda. 14g protein and 6g carbs.'
});

comments = [
	newMessage({
		parentmessage: note.id,
		from: 'Dr. Jona',
		to: 'Paul',
		timestamp: '2014-02-16T15:20:00+00:00',
		createdtime: '2014-02-16T15:20:00+00:00',
		messagetext: 'That\'s an amazing muffin for diabetes and GF. Great food choice for all your kids :)'
	}),
	newMessage({
		parentmessage: note.id,
		from: 'Melissa',
		to: 'Paul',
		timestamp: '2014-02-16T15:22:00+00:00',
		createdtime: '2014-02-16T15:22:00+00:00',
		messagetext: 'It also tastes really good. Glycemic index is high but it doesn\'t make a big diff with only 6g carbs!'
	})
];

messages['Paul'] = messages['Paul'].concat([note]).concat(comments);

// Charles
// ====================================

messages['Charles'] = [
	newMessage({
		from: 'Charles',
		to: 'Charles',
		timestamp: '2014-03-09T15:31:00+00:00',
		createdtime: '2014-03-09T15:31:00+00:00',
		messagetext: 'Ripped off insertion set. #ouch Pump off 9am-2:30p. Very long walk 9:40-1pm. #bgnow 74'
	}),
	newMessage({
		from: 'Charles',
		to: 'Charles',
		timestamp: '2014-02-05T09:27:00+00:00',
		createdtime: '2014-02-05T09:27:00+00:00',
		messagetext: '#sitechange'
	}),
	newMessage({
		from: 'Charles',
		to: 'Charles',
		timestamp: '2014-02-05T23:16:00+00:00',
		createdtime: '2014-02-05T23:16:00+00:00',
		messagetext: 'Dinner at Fred\'s. Veggie burger.'
	})
];

note = newMessage({
	from: 'Charles',
	to: 'Charles',
	timestamp: '2013-12-22T23:07:40+00:00',
	createdtime: '2013-12-22T23:07:40+00:00',
	messagetext: 'There is a bit of pressure leading up to the holidays, I find that even a small amount of exercise each morning helps with the stress.'
});

comments = [
	newMessage({
		parentmessage: note.id,
		from: 'Charles',
		to: 'Charles',
		timestamp: '2013-12-24T23:07:40+00:00',
		createdtime: '2013-12-24T23:07:40+00:00',
		messagetext: 'Will try and apply my stress & life balance measures to xmas day tomorrow and see how it goes.'
	}),
	newMessage({
		parentmessage: note.id,
		from: 'Charles',
		to: 'Charles',
		timestamp: '2013-12-25T23:07:40+00:00',
		createdtime: '2013-12-25T23:07:40+00:00',
		messagetext: 'I have struggled to resist the temptations of Christmas but did go for a ride early in the day that helped to balance things out.'
	}),
	newMessage({
		parentmessage: note.id,
		from: 'Dr. Jona',
		to: 'Charles',
		timestamp: '2014-01-04T23:07:40+00:00',
		createdtime: '2014-01-04T23:07:40+00:00',
		messagetext: 'It sounds like you coped well over the Christmas & New Years period given the temptations'
	})
];

messages['Charles'] = messages['Charles'].concat([note]).concat(comments);

// All data
// ====================================

var data = {};

data.loggedInUser = _.cloneDeep(users['Paul']);
data.loggedInUser.notes = messages['Paul'];
data.loggedInUser.teams = [
	{
		userid: users['Charles'].userid,
		profile: _.clone(users['Charles'].profile),
		notes: messages['Charles']
	}
];

module.exports = data;
