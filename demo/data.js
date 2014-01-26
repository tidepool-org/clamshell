
var data = {
	users : {},
	groups : {}
};

/* our logged in primary user and the doc*/
data.users = [

	{
	  "id": "4505aca5-b0f0-4ae1-9443-8314350ac1fb",
	  "username": "jamie.bate@testing.org",
	  "firstName": "Jamie",
	  "lastName": "Bate"
	},
	{
		"id": "6f9d5f0d-5313-4782-b708-d9ae002222e9",
	  	"username": "dr.bob@testing.org",
	  	"firstName": "Dr Bob",
	  	"lastName": "Bob"
	}
];

/* the two groups this primamry user belongs to. His careteam and his daughters careteam (who is also a type 1)*/
data.groups = [
	{
		id : "f32d0dce-8f2f-4d2c-a03b-692cc9586965",
		name: "Jamie's Care Team",
		owners : ["4505aca5-b0f0-4ae1-9443-8314350ac1fb"],
		members : ["4505aca5-b0f0-4ae1-9443-8314350ac1fb","6f9d5f0d-5313-4782-b708-d9ae002222e9"],
		patient : "4505aca5-b0f0-4ae1-9443-8314350ac1fb",
		messages : [
			{
				id : '9233c2ae-7bad-41f5-9295-e73f0437295b',
				rootmessageid : '9233c2ae-7bad-41f5-9295-e73f0437295b',
				userid : '4505aca5-b0f0-4ae1-9443-8314350ac1fb',
				groupid : 'f32d0dce-8f2f-4d2c-a03b-692cc9586965',
				timestamp : '2013-12-22T23:07:40+00:00',
				messagetext : 'There is a bit of pressure on in the lead up to the holidays, I am finding even a bit of excerise each morning helps with the stress and '
			},
			{
				id : '72428a86-b1c8-41cd-8d62-31b57128d590',
				rootmessageid : '9233c2ae-7bad-41f5-9295-e73f0437295b',
				userid : '4505aca5-b0f0-4ae1-9443-8314350ac1fb',
				groupid : 'f32d0dce-8f2f-4d2c-a03b-692cc9586965',
				timestamp : '2013-12-24T23:07:40+00:00',
				messagetext : 'Will try and apply my stress / life balance measures to xmas day tomorrow and see how it goes.'
			},
			{
				id : '1a4a8a93-cc02-43ba-acd6-4edb6c5eadf9',
				rootmessageid : '9233c2ae-7bad-41f5-9295-e73f0437295b',
				userid : '4505aca5-b0f0-4ae1-9443-8314350ac1fb',
				groupid : 'f32d0dce-8f2f-4d2c-a03b-692cc9586965',
				timestamp : '2013-12-25T23:07:40+00:00',
				messagetext : 'I have struggled to resist the temptations of Christmas but did go for a ride early in the day that help to Balance things out.'
			},
			{
				id : 'bd3de6e4-d805-4ca7-a3b9-2e0eb4e221ca',
				userid : '6f9d5f0d-5313-4782-b708-d9ae002222e9', //Doc
				rootmessageid : '9233c2ae-7bad-41f5-9295-e73f0437295b',
				groupid : 'f32d0dce-8f2f-4d2c-a03b-692cc9586965',
				timestamp : '2014-01-04T23:07:40+00:00',
				messagetext : 'It sounds like you coped well over the Christmas / New Years period given the temptations'
			},
			{
				id : '070159bf-bd33-4998-b874-6b9c2bafe7fb',
				userid : '4505aca5-b0f0-4ae1-9443-8314350ac1fb',
				rootmessageid : '070159bf-bd33-4998-b874-6b9c2bafe7fb',
				groupid : 'f32d0dce-8f2f-4d2c-a03b-692cc9586965',
				timestamp : '2014-01-05T23:07:40+00:00',
				messagetext : 'Big hypo yesterday. I went for a longer than normal ride. I ate well during but didn\'t have lunch until late after the ride. Maybe a good snack just after???'
			}
		]
	},
	{
		id : "07abb942-5c77-4c87-aa94-12c08b805d7f",
		name: "Lucca's Care Team",
		owners : ["4505aca5-b0f0-4ae1-9443-8314350ac1fb"],
		members : ["4505aca5-b0f0-4ae1-9443-8314350ac1fb","2a81bf1b-b274-4203-8c30-980401b1918f","6f9d5f0d-5313-4782-b708-d9ae002222e9"],
		patient : "2a81bf1b-b274-4203-8c30-980401b1918f",
		messages : [
			{
				id : '676e2573-286f-4a7f-bc1e-030aa93110ff',
				rootmessageid : '',
				userid : '4505aca5-b0f0-4ae1-9443-8314350ac1fb',
				groupid : '07abb942-5c77-4c87-aa94-12c08b805d7f',
				timestamp : '2014-01-02T23:07:40+00:00',
				messagetext : 'Sick with a cold, still active but not at the same levels she normally is.'
			},
			{
				id : '74d53833-fad7-44fb-b5ee-4a3772c2857b',
				rootmessageid : '',
				userid : '4505aca5-b0f0-4ae1-9443-8314350ac1fb',
				groupid : '07abb942-5c77-4c87-aa94-12c08b805d7f',
				timestamp : '2014-01-03T23:07:40+00:00',
				messagetext : 'Overnight low that we caught thankfully. We were very busy yesterday arvo and the kids probably didn\'t have enough snacks on hand'
			},
			{
				id : '7a4d1d3e-379d-4882-ad2e-51ea7188db71',
				rootmessageid : '',
				userid : '4505aca5-b0f0-4ae1-9443-8314350ac1fb',
				groupid : '07abb942-5c77-4c87-aa94-12c08b805d7f',
				timestamp : '2014-01-03T23:07:40+00:00',
				messagetext : 'Perfect day really, just good to not that we do have these!'
			}
		]
	}
];


module.exports = data;


