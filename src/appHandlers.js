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
    app.trackMetric('Logged Out');
    app.log('logging out');
    app.api.user.logout(function(error,success){
      if(error){
        component.handleError(error);
      }
      component.setState({
        routeName: app.routes.login,
        authenticated: false,
        showingMenu: false
      });
      return;
    }.bind(this));
  };

  /**
   * Set app state to handle the back command
   */
  component.handleBack =function(){
    app.trackMetric('Go Back');
    var previousRoute = component.state.previousRoute;
    var currentRoute = component.state.routeName;

    if(!previousRoute || previousRoute === currentRoute){

      previousRoute = app.routes.messagesForAllTeams;
    }
    component.setState({routeName:previousRoute});
  };

  component.handleOpenMenu = function() {
    app.trackMetric('Open Menu');
    // Don't try to render if nothing to show
    if (!component.state.loggedInUser) {
      return;
    }
    component.setState({showingMenu:true});
  };

  component.handleCloseMenu = function() {
    app.trackMetric('Close Menu');
    component.setState({showingMenu:false});
  };

  /**
   * Basic handler when an error has occured, we just show the message
   *
   * @param {Error} error - The error that has occured to be shown.
   */
  component.handleError =function(error){

    if(error.status){
      if(error.status === 401){
        //go to login
        app.log('redirect to login');
        component.setState({
          routeName: app.routes.login,
          authenticated: false,
          showingMenu: false
        });
        return;
      } else if (error.status === 500){
        app.log('500 from server');
        //show what went wrong
        return component.handleNotification(error.body,'error');
      }
    }

    return component.handleNotification(error,'error');
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
    app.trackMetric('Logged In');
    component.setState({ authenticated : true });
    component.loadUserData();
  };

  /**
   * Load a message thread from the platform
   *
   * @param {Message} mostRecentMessageInThread - The most recent message in a thread
   */
  component.handleShowConversationThread = function(mostRecentMessageInThread){
    app.trackMetric('Show Note Thread');
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
    app.trackMetric('Add Note');
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
      component.setState({
        selectedUser: userToUpdate,
        lastNoteAdded: addedNote
      });
    }.bind(this));
  };

  /**
   * Add a comment to an existing thread
   *
   * @param {Object} note - A comment on the thread
   */
  component.handleAddingToConversation = function(note){
    app.trackMetric('Add Comment');
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
      component.setState({
        selectedThread: thread,
        lastCommentAdded: addedComment
      });
    }.bind(this));

  };

  /**
   * Change which user is being displayed
   *
   * @param {Object} selectedUser - the user that has been selected
   */
  component.handleUserChanged = function(selectedUserId){
    app.trackMetric('Changed Selected User');
    var userToDisplay = app.dataHelper.getSelectedUser(
      selectedUserId,
      component.state.loggedInUser
    );

    component.setState({
      routeName : app.routes.messagesForSelectedTeam,
      selectedUser : userToDisplay,
      previousRoute : component.state.routeName,
      showingMenu : false
    });
  };
};
