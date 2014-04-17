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

var data = {
	loggedInUser : {
		userid : 'user-id-123',
		profile : { firstName: 'Foo',lastName:'Bar'},
		notes : [],//has none
		teams : []
	}
};

/* Just the one team*/
data.loggedInUser.teams =
	[{
		userid : 'user-id-456',
		profile : {firstName:'Funky',lastName:'Diabetic'},
		notes : [
			{
				id : '9233c2ae-7bad-41f5-9295-e73f0437295b',
				parentmessage : null,
				userid : 'user-id-456',
				groupid : 'user-id-456',
				user : {firstName:'Funky',lastName:'Diabetic'},
				timestamp : '2013-12-22T23:07:40+00:00',
				messagetext : 'There is a bit of pressure on in the lead up to the holidays, I am finding even a bit of excerise each morning helps with the stress and '
			},
			{
				id : '72428a86-b1c8-41cd-8d62-31b57128d590',
				parentmessage : '9233c2ae-7bad-41f5-9295-e73f0437295b',
				userid : 'user-id-456',
				groupid : 'user-id-456',
				user : {firstName:'Funky',lastName:'Diabetic'},
				timestamp : '2013-12-24T23:07:40+00:00',
				messagetext : 'Will try and apply my stress / life balance measures to xmas day tomorrow and see how it goes.'
			},
			{
				id : '1a4a8a93-cc02-43ba-acd6-4edb6c5eadf9',
				parentmessage : '9233c2ae-7bad-41f5-9295-e73f0437295b',
				userid : 'user-id-456',
				groupid : 'user-id-456',
				user : {firstName:'Funky',lastName:'Diabetic'},
				timestamp : '2013-12-25T23:07:40+00:00',
				messagetext : 'I have struggled to resist the temptations of Christmas but did go for a ride early in the day that help to Balance things out.'
			},
			{
				id : 'bd3de6e4-d805-4ca7-a3b9-2e0eb4e221ca',
				parentmessage : '9233c2ae-7bad-41f5-9295-e73f0437295b',
				userid : 'user-id-123', //Doc
				groupid : 'user-id-456',
				user : { firstName: 'Foo',lastName:'Bar'},
				timestamp : '2014-01-04T23:07:40+00:00',
				messagetext : 'It sounds like you coped well over the Christmas / New Years period given the temptations'
			},
			{
				id : '070159bf-bd33-4998-b874-6b9c2bafe7fb',
				userid : 'user-id-456',
				parentmessage : null,
				groupid : 'user-id-456',
				user : {firstName:'Funky',lastName:'Diabetic'},
				timestamp : '2014-01-05T23:07:40+00:00',
				messagetext : 'Big hypo yesterday. I went for a longer than normal ride. I ate well during but didn\'t have lunch until late after the ride. Maybe a good snack just after???'
			}
		]
	}];

module.exports = data;


