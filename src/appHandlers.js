/**
 * @jsx React.DOM
 */

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

module.exports = function(app,helpers) {

  

  //---------- App Handlers ----------
  app.handleLogout =function(){
    app.log('logging out');
    helpers.api.user.deleteSession(function(success){
      if(success){
        helpers.log('logged out');
        app.setState({
          routeName: helpers.routes.login,
          authenticated: false
        });
        return;
      }
    }.bind(this));
  };

  app.handleBack =function(){
    var previousRoute = app.state.previousRoute;
    if(!previousRoute){
      helpers.warn('route was not set for some reason');
      previousRoute = helpers.routes.messagesForAllTeams;
    }
    app.setState({routeName:previousRoute});
  };

  app.handleLoginSuccess = function(){
    app.setState({authenticated: true});
    app.fetchUserData(function(){
      app.setState({
        authenticated : true,
        routeName : helpers.routes.messagesForSelectedTeam,
        loggedInUser : helpers.api.user.get()
      });
    }.bind(this));
  },

  app.handleShowConversationThread = function(mostRecentMessageInThread){

    var messagesId = mostRecentMessageInThread.id;

    if(mostRecentMessageInThread.parentmessage){
      messagesId = mostRecentMessageInThread.parentmessage;
    }

    var team = helpers.dataHelper.getTeam(app.state.userGroupsData,mostRecentMessageInThread.groupid);
    var thread = helpers.dataHelper.getThread(team,messagesId);

    app.setState({
      selectedThread : thread,
      selectedGroup : team,
      routeName : helpers.routes.messageThread,
      previousRoute : app.state.routeName
    });
  };

  app.handleStartConversation = function(note){

    var thread = {
      userid : app.state.loggedInUser.userid,
      groupid : app.state.selectedGroup.id,
      timestamp : new Date(),
      messagetext : note.text
    };

    helpers.api.notes.add(thread,function(error){
      helpers.log('thread started');
      if(error){
        helpers.log.error(error);
        app.setState({routeName : helpers.routes.message, userMessage : error });
        return;
      }
    }.bind(this));

    var updatedTeamNotes = app.state.selectedGroup;

    updatedTeamNotes.notes.unshift(thread);

    app.setState({selectedGroup : updatedTeamNotes});

  };

  app.handleAddingToConversation = function(note){

    var thread = app.state.selectedThread;
    var parentId = app.dataHelper.getParentMessageId(thread);

    var comment = {
      parentmessage : parentId,
      userid : app.state.loggedInUser.userid,
      groupid : app.state.selectedGroup.id,
      timestamp : new Date(),
      messagetext : note.text
    };

    helpers.api.notes.reply(comment,function(error){
      helpers.log('reply added');
      if(error){
        helpers.log.error(error);
        app.setState({routeName : helpers.routes.message, userMessage : error });
        return;
      }
    }.bind(this));

    thread.push(comment);
    app.setState({selectedThread: thread});
  };

  app.handleGroupChanged = function(selectedGroup){
    var group = _.find(
      app.state.userGroupsData, function(group){
        return selectedGroup.groupId == group.id;
      });

    app.setState({
      routeName : helpers.routes.messagesForSelectedTeam,
      selectedGroup : group,
      previousRoute : app.state.routeName
    });
  };
};