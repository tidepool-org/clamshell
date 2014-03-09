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

module.exports = function(app) {


  //---------- App Handlers ----------
  app.components.handleLogout =function(){
    app.log('logging out');
    app.api.user.deleteSession(function(success){
      if(success){
        app.log('logged out');
        app.components.setState({
          routeName: app.routes.login,
          authenticated: false
        });
        return;
      }
    }.bind(this));
  };

  app.components.handleBack =function(){
    var previousRoute = app.components.state.previousRoute;
    if(!previousRoute){
      app.warn('route was not set for some reason');
      previousRoute = app.routes.messagesForAllTeams;
    }
    app.components.setState({routeName:previousRoute});
  };

  app.components.handleError =function(error){
    app.log.error(error);
    app.components.setState({routeName : app.routes.message, userMessage : error });
  };

  app.components.handleLoginSuccess = function(){
    app.components.setState({authenticated: true});
    app.components.fetchUserData(function(){
      app.components.setState({
        authenticated : true,
        routeName : app.routes.messagesForSelectedTeam,
        loggedInUser : app.api.user.get()
      });
    }.bind(this));
  },

  app.components.handleShowConversationThread = function(mostRecentMessageInThread){

    var messagesId = mostRecentMessageInThread.id;

    if(mostRecentMessageInThread.parentmessage){
      messagesId = mostRecentMessageInThread.parentmessage;
    }

    var team = app.dataHelper.getTeam(app.components.state.userGroupsData,mostRecentMessageInThread.groupid);
    var thread = app.api.notes.getThread(messagesId,function(error,thread){

      if(error){
        return app.components.handleError(error);
      }

      app.components.setState({
        selectedThread : thread,
        selectedGroup : team,
        routeName : app.routes.messageThread,
        previousRoute : app.components.state.routeName
      });
    });

  };

  app.components.handleStartConversation = function(note){

    var thread = {
      userid : app.components.state.loggedInUser.userid,
      username : app.components.state.loggedInUser.name,
      groupid : app.components.state.selectedGroup.id,
      timestamp : new Date(),
      messagetext : note.text
    };

    app.api.notes.add(thread,function(error){
      app.log('thread started');
      if(error){
        return app.components.handleError(error);
      }
    }.bind(this));

    var updatedTeamNotes = app.components.state.selectedGroup;

    updatedTeamNotes.notes.unshift(thread);

    app.components.setState({selectedGroup : updatedTeamNotes});

  };

  app.components.handleAddingToConversation = function(note){

    var thread = app.components.state.selectedThread;
    var parentId = app.components.dataHelper.getParentMessageId(thread);

    var comment = {
      parentmessage : parentId,
      userid : app.components.state.loggedInUser.userid,
      username : app.components.state.loggedInUser.name,
      groupid : app.components.state.selectedGroup.id,
      timestamp : new Date(),
      messagetext : note.text
    };

    app.api.notes.reply(comment,function(error){
      app.log('reply added');
      if(error){
        return app.components.handleError(error);
      }
    }.bind(this));

    thread.push(comment);
    app.components.setState({selectedThread: thread});
  };

  app.components.handleGroupChanged = function(selectedGroup){
    var group = _.find(
      app.components.state.userGroupsData, function(group){
        return selectedGroup.groupId == group.id;
      });

    app.components.setState({
      routeName : app.routes.messagesForSelectedTeam,
      selectedGroup : group,
      previousRoute : app.components.state.routeName
    });
  };
};