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

module.exports = function(component,app) {

  var _ = require('lodash');


  /**
   * Delete the users session and set app state to be logged out
   */
  component.handleLogout =function(){
    app.log('logging out');
    app.api.user.deleteSession(function(success){
      if(success){
        app.log('logged out');
        component.setState({
          routeName: app.routes.login,
          authenticated: false
        });
        return;
      }
    }.bind(this));
  };

  /**
   * Set app state to handle the back command
   */
  component.handleBack =function(){
    var previousRoute = component.state.previousRoute;
    if(!previousRoute){
      app.warn('route was not set for some reason');
      previousRoute = app.routes.messagesForAllTeams;
    }
    component.setState({routeName:previousRoute});
  };

  /**
   * Basic handler when an error has occured, we just show the message
   *
   * @param {Error} error - The error that has occured to be shown.
   */
  component.handleError =function(error){
    app.log.error(error);
    component.setState({
      routeName : app.routes.message,
      userMessage : error,
      userMessageIsError : true,
      previousRoute : component.state.routeName
    });
  };

  /**
   * Trigger load of user data on successful login
   */
  component.handleLoginSuccess = function(){
    component.loadUserData();
  };

  /**
   * Load a message thread from the platform
   *
   * @param {Message} mostRecentMessageInThread - The most recent message in a thread
   */
  component.handleShowConversationThread = function(mostRecentMessageInThread){

    var messagesId = mostRecentMessageInThread.id;

    if(mostRecentMessageInThread.parentmessage){
      messagesId = mostRecentMessageInThread.parentmessage;
    }

    var team = app.dataHelper.getTeam(component.state.userGroupsData,mostRecentMessageInThread.groupid);
    app.api.notes.getThread(messagesId,function(error,thread){

      if(error){
        return component.handleError(error);
      }

      component.setState({
        selectedThread : thread,
        selectedGroup : team,
        routeName : app.routes.messageThread,
        previousRoute : component.state.routeName
      });
    });

  };

  /**
   * Save the given message to the platform
   *
   * @param {Object} note - The root message text of this thread
   */
  component.handleStartConversation = function(note){

    var thread = {
      userid : component.state.loggedInUser.userid,
      username : component.state.loggedInUser.profile.firstName,
      groupid : component.state.selectedGroup.id,
      timestamp : new Date(),
      messagetext : note.text
    };

    app.api.notes.add(thread,function(error,addedNote){
      app.log('thread started');
      if(error){
        return component.handleError(error);
      }
      var updatedTeamNotes = component.state.selectedGroup;
      updatedTeamNotes.notes.unshift(addedNote);
      component.setState({selectedGroup : updatedTeamNotes});

    }.bind(this));
  };

  /**
   * Add a comment to an existing thread
   *
   * @param {Object} note - A comment on the thread
   */
  component.handleAddingToConversation = function(note){

    var thread = component.state.selectedThread;
    var parentId = app.dataHelper.getParentMessageId(thread);

    var comment = {
      parentmessage : parentId,
      userid : component.state.loggedInUser.userid,
      username : component.state.loggedInUser.profile.firstName,
      groupid : component.state.selectedGroup.id,
      timestamp : new Date(),
      messagetext : note.text
    };

    app.api.notes.reply(comment,function(error, addedComment){
      app.log('reply added');
      if(error){
        return component.handleError(error);
      }
      thread.push(addedComment);
      component.setState({selectedThread: thread});
    }.bind(this));

  };

  /**
   * Change which group is being displayed
   *
   * @param {Object} selectedGroup - the group that has been selected
   */
  component.handleGroupChanged = function(selectedGroup){
    var group = _.find(
      component.state.userGroupsData, function(group){
        return selectedGroup.groupId == group.id;
      });

    component.setState({
      routeName : app.routes.messagesForSelectedTeam,
      selectedGroup : group,
      previousRoute : component.state.routeName
    });
  };
};