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

var userDataHelper = {
  getParentMessageId: function(thread) {
    var parentNote = _.findWhere(thread, { parentmessage : null });
    return parentNote.id;
  },
  getThread: function(team, parentmessageId) {

    var notesInThread = _.where(team.notes, {parentmessage: parentmessageId});
    var parentNote = _.findWhere(team.notes, {id: parentmessageId});

    var thread;

    if(notesInThread.length > 0){
      notesInThread.push(parentNote);
      thread = _.sortBy(notesInThread, function(note){ return note.timestamp; });
    }else{
      thread = [parentNote];
    }

    return thread;
  },
  getTeam: function(userTeams, groupId) {
    return _.find(userTeams,
      function(team){
        return groupId === team.id;
      }
    );
  },
  combineTeams : function (teamToAdd,existingTeams){
    existingTeams.push(teamToAdd);
    return _.uniq(existingTeams, function(team) { return team.id; });
  },
  hasMultipleTeams : function(userTeams) {
    return (_.size(userTeams) > 1);
  },
  createMessage : function(messageText,user,groupId){
    var message = {
      userid : user.userid,
      username : user.profile.firstName,
      groupid : groupId,
      timestamp : new Date().toISOString(),
      messagetext : messageText
    };
    return message;
  },
  createReply : function(replyText, user, parentId, groupId ){

    var reply = {
      parentmessage : parentId,
      userid : user.userid,
      username : user.profile.firstName,
      groupid : groupId,
      timestamp : new Date().toISOString(),
      messagetext : replyText
    };

    return reply;
  }
};

module.exports = userDataHelper;