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

var userDataHelper = {
  getParentMessageId: function(thread) {
    var parentNote = _.findWhere(thread, function(message) {
      return message.parentmessage == null;
    });
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
  getCommentsCount: function(noteId, allMessages) {
    var comments = this.commentsForNote(noteId, allMessages);
    if(_.isEmpty(comments)){
      return 0;
    }
    return comments.length;
  },
  filterNotes : function(notesToFilter){
    return  _.filter(notesToFilter, function(note) {
      return (!note.parentmessage);
    });
  },
  sortNotesDescending : function(notesToSort){
    return this.sortNotesAscending(notesToSort).reverse();
  },
  /*
   * In the given list find any comments for the given note id
   */
  commentsForNote : function(noteId, allMessages){
    return _.filter(allMessages, {parentmessage: noteId});
  },
  /*
   * Sort any message in an ASC order based on date
   */
  sortAscending : function(messages){
    var self = this;
    return _.sortBy(messages, function(message) {
      return self.messageDate(message);
    });
  },
  /*
   * Return the date for a message to be used
   * when ordering message lists for display
   */
  messageDate : function(message){
    if(_.isEmpty(message.createdtime)){
      return new Date(message.timestamp);
    }
    return new Date(message.createdtime);
  },
  /*
   * Sort 'Notes' by the most recent date between the
   * note itself and the comments attached to it, if any"
   */
  sortNotesAscending : function(notesToSort){
    var self = this;
    return _.sortBy(notesToSort, function(note) {
      //we just want notes
      if(_.isEmpty(note.parentmessage)){
        var comments = self.commentsForNote(note.id, notesToSort);
        //does the note have any comments?
        if( _.isEmpty(comments) == false ) {
          comments = self.sortAscending(comments);
          //sort using date of newest comment
          return self.messageDate(comments[0]);
        }
        //sort on notes date
        return self.messageDate(note);
      }
    });
  },
  getNotesForTeams : function(teams){
    return  _.flatten(_.map(teams, 'notes'));
  },
  getAllNotesForLoggedInUser : function(loggedIn){
    if(_.isEmpty(loggedIn.notes)){
      return this.getNotesForTeams(loggedIn.teams);
    }
    return loggedIn.notes.concat(this.getNotesForTeams(loggedIn.teams));
  },
  formatDisplayDate : function(timestamp){
    if(timestamp){
      var offset = sundial.getOffsetFromTime(timestamp);
      return sundial.formatFromOffset(timestamp, offset);
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
