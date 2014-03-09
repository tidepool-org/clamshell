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

  //---------- App Handlers ----------
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

  component.handleBack =function(){
    var previousRoute = component.state.previousRoute;
    if(!previousRoute){
      app.warn('route was not set for some reason');
      previousRoute = app.routes.messagesForAllTeams;
    }
    component.setState({routeName:previousRoute});
  };

  component.handleError =function(error){
    app.log.error(error);
    component.setState({routeName : app.routes.message, userMessage : error });
  };

  component.handleLoginSuccess = function(){
    component.setState({authenticated: true});
    component.fetchUserData(function(){
      component.setState({
        authenticated : true,
        routeName : app.routes.messagesForSelectedTeam,
        loggedInUser : app.api.user.get()
      });
    }.bind(this));
  },

  component.handleShowConversationThread = function(mostRecentMessageInThread){

    var messagesId = mostRecentMessageInThread.id;

    if(mostRecentMessageInThread.parentmessage){
      messagesId = mostRecentMessageInThread.parentmessage;
    }

    var team = app.dataHelper.getTeam(component.state.userGroupsData,mostRecentMessageInThread.groupid);
    var thread = app.api.notes.getThread(messagesId,function(error,thread){

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

  component.handleStartConversation = function(note){

    var thread = {
      userid : component.state.loggedInUser.userid,
      username : component.state.loggedInUser.profile.shortname,
      groupid : component.state.selectedGroup.id,
      timestamp : new Date(),
      messagetext : note.text
    };

    app.api.notes.add(thread,function(error){
      app.log('thread started');
      if(error){
        return component.handleError(error);
      }
    }.bind(this));

    var updatedTeamNotes = component.state.selectedGroup;

    updatedTeamNotes.notes.unshift(thread);

    component.setState({selectedGroup : updatedTeamNotes});

  };

  component.handleAddingToConversation = function(note){

    var thread = component.state.selectedThread;
    var parentId = app.dataHelper.getParentMessageId(thread);

    var comment = {
      parentmessage : parentId,
      userid : component.state.loggedInUser.userid,
      username : component.state.loggedInUser.profile.shortname,
      groupid : component.state.selectedGroup.id,
      timestamp : new Date(),
      messagetext : note.text
    };

    app.api.notes.reply(comment,function(error){
      app.log('reply added');
      if(error){
        return component.handleError(error);
      }
    }.bind(this));

    thread.push(comment);
    component.setState({selectedThread: thread});
  };

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