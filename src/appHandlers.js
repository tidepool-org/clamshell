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
  /**
   * Delete the users session and set app state to be logged out
   */
  component.handleLogout =function(){
    app.log('logging out');
    app.api.user.logout(function(error,success){
      if(error){
        component.handleError(error);
      }
      component.setState({
        routeName: app.routes.login,
        authenticated: false
      });
      return;
    }.bind(this));
  };

  component.handleRefresh =function(){
    app.log('refreshing ...');
    component.setState({ loadingData : true });

    app.api.user.refresh(function(){
      app.log('user refreshed');
      app.api.user.teams.refresh(function(){
        app.log('refreshing teams');
        component.setState({
          loadingData : false
          // Call showUserData only after state has been updated
          }, component.showUserData);
        });
    });
  };

  /**
   * Set app state to handle the back command
   */
  component.handleBack =function(){
    var previousRoute = component.state.previousRoute;
    var currentRoute = component.state.routeName;

    if(!previousRoute || previousRoute === currentRoute){

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
    return component.handleNotification(error,'danger');
  };

  /**
   * Basic handler when a message needs to be shown to the user
   *
   * @param message - The notification message to show
   * @param type - The type of notification show, defaults to `info`
   */
  component.handleNotification =function(message,type){

    type = type ? type : 'success';

    component.setState({
      notification : { message: message, type: type}
    });
  };

  /**
   * Clears the notification
   */
  component.handleNotificationDismissed = function(){
    component.setState({ notification : null });
  };

  /**
   * Trigger load of user data on successful login
   */
  component.handleLoginSuccess = function(){
    component.setState({ authenticated : true });
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

    app.api.notes.getThread(messagesId,function(error,thread){

      if(error){
        return component.handleError(error);
      }

      var userToDisplay = app.dataHelper.getSelectedUser(
        mostRecentMessageInThread.groupid,
        component.state.loggedInUser
      );

      component.setState({
        selectedThread : thread,
        routeName : app.routes.messageThread,
        selectedUser : userToDisplay,
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

    var message = app.dataHelper.createMessage(
      note.text,
      component.state.loggedInUser,
      component.state.selectedUser.userid
      );

    app.api.notes.add(message,function(error,addedNote){
      app.log('thread started');
      if(error){
        return component.handleError(error);
      }
      var userToUpdate = component.state.selectedUser;
      userToUpdate.notes.unshift(addedNote);
      component.setState({ selectedUser : userToUpdate });
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

    //we set the parentId here
    var comment = app.dataHelper.createMessage(
      note.text,
      component.state.loggedInUser,
      component.state.selectedUser.userid,
      parentId
      );

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
   * Change which user is being displayed
   *
   * @param {Object} selectedUser - the user that has been selected
   */
  component.handleUserChanged = function(selectedUserId){

    var userToDisplay = app.dataHelper.getSelectedUser(
      selectedUserId,
      component.state.loggedInUser
    );

    component.setState({
      routeName : app.routes.messagesForSelectedTeam,
      selectedUser : userToDisplay,
      previousRoute : component.state.routeName
    });
  };
};
