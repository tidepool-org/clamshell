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
var moment = require('moment');

var userDataHelper = {
  getParentMessageId: function(thread) {
    var parentNote = _.findWhere(thread, { parentmessage : null });
    return parentNote.id;
  },
  getThread: function(team, parentmessageId) {

    var notesInThread = _.where(team.notes, {parentmessage: parentmessageId});
    var parentNote = _.findWhere(team.notes, {id: parentmessageId});

    if(_.isEmpty(notesInThread)){
      return [parentNote];
    } else {
      notesInThread.push(parentNote);
      return this.sortNotesDescending(notesInThread);
    }
  },
  getSelectedUser:function(userId,data){
    if(userId === data.userid){
      return data;
    }
    return _.find(data.teams, function(team){
      return userId === team.userid;
    });
  },
  getComments: function(parentmessageId) {
    return 'todo';
  },
  filterNotes : function(notesToFilter){
    return  _.filter(notesToFilter, function(note) {
      return (!note.parentmessage);
    });
  },
  sortNotesDescending : function(notesToSort){
    return this.sortNotesAscending(notesToSort).reverse();
  },
  sortNotesAscending : function(notesToSort){
    return _.sortBy(notesToSort, function(note) {
      return new Date(note.timestamp);
    });
  },
  getNotesForTeams : function(teams){
    return _.flatten(teams,'notes');
  },
  getAllNotesForLoggedInUser : function(loggedIn){
    if(_.isEmpty(loggedIn.notes)){
      return this.getNotesForTeams(loggedIn.teams);
    }
    return loggedIn.notes.concat(this.getNotesForTeams(loggedIn.teams));
  },
  formatDisplayDate : function(timestamp){
    if(timestamp){
      return moment(timestamp).format('MMMM D [at] h:mm a');
    }
    return;
  },
  formatShortName : function(userProfile){
    if(userProfile && userProfile.shortName){
      return userProfile.shortName;
    }

    if(userProfile && userProfile.firstName){
      return userProfile.firstName;
    }

    return null;
  },
  formatFullName : function(userProfile){
    if(userProfile && userProfile.fullName){
      return userProfile.fullName;
    }

    if(userProfile && userProfile.firstName){
      var fullname = userProfile.firstName;
      if(userProfile.lastName){
        fullname += ' '+userProfile.lastName;
      }
      return fullname;
    }

    return null;
  },
  createMessage : function(messageText, user, groupId, parentId){

    var d = new Date();

    var message = {
      parentmessage : parentId,
      userid : user.userid,
      user : user.profile,
      groupid : groupId,
      timestamp : d.toISOString(),
      messagetext : messageText
    };

    return message;
  }
};

module.exports = userDataHelper;
