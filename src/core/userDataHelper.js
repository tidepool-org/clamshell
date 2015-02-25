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

var _ = require('lodash');

var sundial = require('sundial');
var moment = sundial.momentInstance();

// Wordbank vars
var HASHTAG_REGEX = /#\w+/g;
var PREDEF_TAGS = ['#juicebox', '#BGnow', '#dessert', '#wopw', '#pizza',
  '#bailey', '#hypo', '#goawaydad', '#biking', '#100woot!'];
var MAX_DISPLAY_TAGS = 10;
var wordbankMemo = {};

var userDataHelper = {
  getSelectedUser:function(userId,data){
    if(userId === data.userid){
      return data;
    }
    return _.find(data.teams, function(team){
      return userId === team.userid;
    });
  },
  /**
   * Get the list of tagged words for a user's notes. Memoize result.
   * @param userid
   * @param notes
   * @returns {Array}
   */
  getWordbankWords: function(userid, notes) {
    // return memoized list if note count is unchanged
    if (wordbankMemo[userid] && wordbankMemo[userid].numMessages === notes.length) {
      return wordbankMemo[userid].topWords;
    }

    wordbankMemo[userid] = {
      numMessages: notes.length,
      wordFreqs: {}
    };
    var memo = wordbankMemo[userid].wordFreqs;

    PREDEF_TAGS.forEach(function(tag) {
      memo[tag] = 0;
    });

    notes.forEach(function(note) {
      var matches = note.messagetext.match(HASHTAG_REGEX);
      if (matches) {
        matches.forEach(function(match) {
          memo[match] = memo[match] ? memo[match] + 1 : 1;
        });
      }
    });

    // TODO: don't sort the entire list to take the top n
    var topWords = Object.keys(memo).sort(function(a, b) {
      // descending sort. values are non-negative, so this won't overflow
      return memo[b] - memo[a];
    }).slice(0, MAX_DISPLAY_TAGS);

    wordbankMemo[userid].topWords = topWords;

    return topWords;
  },
  formatDisplayDate : function(timestamp){
    if(timestamp){
      return moment(timestamp).format('MMMM D [at] h:mm a');
    }
    return;
  },
  formatFullName : function(userProfile){
    if(userProfile && userProfile.fullName){
      return userProfile.fullName;
    }

    return null;
  },
  formatTeamFullName : function(userProfile){
    var patient = userProfile && userProfile.patient;

    if(patient && patient.isOtherPerson){
      return patient.fullName;
    }

    return this.formatFullName(userProfile);
  },
  createMessage : function(messageText, utcTimestamp, user, groupId, parentId){

    var message = {
      parentmessage : parentId,
      userid : user.userid,
      user : user.profile,
      groupid : groupId,
      timestamp : utcTimestamp,
      messagetext : messageText
    };

    return message;
  }
};

module.exports = userDataHelper;
