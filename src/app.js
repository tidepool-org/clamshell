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

var React = require('react');
var Router = require('director').Router;
var bows = require('bows');
var _ = require('lodash');

var config = require('./appConfig');

/*jshint unused:true */
var Layout = require('./layout/Layout');
var ListNavBar = require('./components/header/ListNavBar');
var MessageFooter = require('./components/footer/MessageFooter');
var Login = require('./components/login/Login');
var TeamPicker = require('./components/header/TeamPicker');
var TeamNotes = require('./components/notes/TeamNotes');
var NoteThread = require('./components/notes/NoteThread');
var UserMessage = require('./components/usermessage/UserMessage');
/*jshint unused:false */

require('./app.css');

//core functionality
var api = require('./core/api')(bows);

if(config.demo){
  require('./core/mock')(api);
} else {
  require('./core/platform')(api,config.apiHost,window.superagent);
}

var app = {
  log : bows('App'),
  api : api,
  dataHelper : require('./core/userDataHelper')
};

var routes = {
  login:'login',
  error:'error',
  messagesForAllTeams:'allGroupsConversations',
  messagesForSelectedTeam:'groupConversations',
  messageThread: 'conversationThread',
  startMessageThread:'newConversation'
};

var ClamShellApp = React.createClass({
  getInitialState: function () {
    return this.initializeAppState();
  },

  //starting state for the app when first used or after logout
  initializeAppState : function(){
    return {
      routeName : routes.login,
      previousRoute : null,
      authenticated : null,
      loggedInUser : null,
      userGroupsData : null,
      selectedGroup : null,
      selectedThread : null,
      userMessage : null
    };
  },

  componentDidMount: function () {

    app.log('setup ...');

    api.user.isAuthenticated(function(authenticated){
      if(authenticated){
        app.log('authenticated so lets getdata');
        this.fetchUserData(function(){
          this.setState({
            authenticated : authenticated,
            routeName: routes.messagesForAllTeams,
            loggedInUser : app.api.user.get()
          });
        }.bind(this));
      }
      var router = new Router({
        '/': this.setState.bind(this, {routeName: routes.login}),
        '/allGroupsConversations': this.setState.bind(this, {routeName: routes.messagesForAllTeams}),
        '/groupConversations': this.setState.bind(this, {routeName: routes.messagesForSelectedTeam}),
        '/conversationThread': this.setState.bind(this, {routeName: routes.messageThread}),
        '/newConversation': this.setState.bind(this, {routeName: routes.startMessageThread})
      });
      router.init();
    }.bind(this));

  },

  //---------- Data Loading ----------
  fetchUserData: function(callback) {
    app.log('fetching user team data');
    api.user.team.get(function(error, team) {
      if(error){
        app.log.error(error);
        this.setState({routeName : routes.error, userMessage : error });
        return;
      }
      this.setState({userGroupsData:[team]});
      callback();
    }.bind(this));
  },

  fetchPatientsData: function(callback) {
    app.log('fetching user patients data');
    api.user.patients.get(function(error, patients) {
      if(error){
        app.log.error(error);
        this.setState({routeName : routes.error, userMessage : error });
        return;
      }
      var all = this.state.userGroupsData.concat(patients);
      this.setState({userGroupsData:all});
      callback();
    }.bind(this));
  },

  //---------- App Handlers ----------

  handleLogout:function(){
    app.log('logging out');
    api.user.deleteSession(function(success){
      if(success){
        app.log('logged out');
        this.setState({
          routeName: routes.login,
          authenticated: false
        });
        return;
      }
    }.bind(this));
  },

  handleBack:function(){
    var previousRoute = this.state.previousRoute;
    if(!previousRoute){
      app.warn('route was not set for some reason');
      previousRoute = routes.messagesForAllTeams;
    }
    this.setState({routeName:previousRoute});
  },

  handleLoginSuccess:function(){
    this.setState({authenticated: true});
    this.fetchUserData(function(){
      this.setState({
        routeName: routes.messagesForAllTeams,
        previousRoute : this.state.routeName,
        loggedInUser : app.api.user.get()
      });
    }.bind(this));
  },

  handleShowConversationThread:function(mostRecentMessageInThread){

    var messagesId = mostRecentMessageInThread.id;

    if(mostRecentMessageInThread.parentmessage){
      messagesId = mostRecentMessageInThread.parentmessage;
    }

    var team = app.dataHelper.getTeam(this.state.userGroupsData,mostRecentMessageInThread.groupid);
    var thread = app.dataHelper.getThread(team,messagesId);

    this.setState({
      selectedThread : thread,
      selectedGroup : team,
      routeName : routes.messageThread,
      previousRoute : this.state.routeName
    });
  },

  handleStartConversation:function(note){

    var thread = {
      userid : this.state.loggedInUser.userid,
      groupid : this.state.selectedGroup.id,
      timestamp : new Date(),
      messagetext : note.text
    };

    app.api.notes.add(thread,function(error){
      app.log('thread started');
      if(error){
        app.log.error(error);
        this.setState({routeName : routes.error, userMessage : error });
        return;
      }
    }.bind(this));

    var updatedTeamNotes = this.state.selectedGroup;

    updatedTeamNotes.notes.push(thread);

    this.setState({selectedGroup : updatedTeamNotes});

  },

  handleAddingToConversation:function(note){

    var thread = this.state.selectedThread;
    var parentId = app.dataHelper.getParentMessageId(thread);

    var comment = {
      parentmessage : parentId,
      userid : this.state.loggedInUser.userid,
      groupid : this.state.selectedGroup.id,
      timestamp : new Date(),
      messagetext : note.text
    };

    app.api.notes.reply(comment,function(error){
      app.log('reply added');
      if(error){
        app.log.error(error);
        this.setState({routeName : routes.error, userMessage : error });
        return;
      }
    }.bind(this));

    thread.push(comment);
    this.setState({selectedThread: thread});
  },

  handleGroupChanged:function(selectedGroup){
    var group = _.find(
      this.state.userGroupsData, function(group){
        return selectedGroup.groupId == group.id;
      });

    this.setState({
      routeName:routes.messagesForSelectedTeam,
      selectedGroup:group,
      previousRoute : this.state.routeName
    });
  },

  //---------- Rendering Layouts ----------

  render: function () {
    var content = this.renderContent();

    return (
      /* jshint ignore:start */
      <div className='app'>
      {content}
      </div>
      /* jshint ignore:end */
      );
  },

  renderMessagesForSelectedTeam:function(){
    return (
      /* jshint ignore:start */
      <Layout>
      <ListNavBar title={this.state.selectedGroup.id} actionIcon='back-icon' onNavBarAction={this.handleBack}>
      <TeamPicker groups={this.state.userGroupsData} onGroupPicked={this.handleGroupChanged} />
      </ListNavBar>
      <TeamNotes groups={[this.state.selectedGroup]} onThreadSelected={this.handleShowConversationThread} />
      <MessageFooter
        messagePrompt='Type a new note here ...'
        btnMessage='Post'
        onFooterAction={this.handleStartConversation}/>
      </Layout>
      /* jshint ignore:end */
      );
  },

  renderMessagesForAllTeams:function(){
    return (
      /* jshint ignore:start */
      <Layout>
      <ListNavBar title='All Notes' actionIcon='logout-icon' onNavBarAction={this.handleBack}>
      <TeamPicker groups={this.state.userGroupsData} onGroupPicked={this.handleGroupChanged} />
      </ListNavBar>
      <TeamNotes groups={this.state.userGroupsData} onThreadSelected={this.handleShowConversationThread} />
      </Layout>
      /* jshint ignore:end */
      );
  },

  renderMessageThread:function(){
    return (
      /* jshint ignore:start */
      <Layout>
      <ListNavBar title={this.state.selectedGroup.id} actionIcon='back-icon' onNavBarAction={this.handleBack} />
      <NoteThread messages={this.state.selectedThread} />
      <MessageFooter
        messagePrompt='Type a comment here ...'
        btnMessage='Post'
        onFooterAction={this.handleAddingToConversation} />
      </Layout>
      /* jshint ignore:end */
      );
  },

  renderLoginLayout:function(){
    return (
      /* jshint ignore:start */
      <Layout>
      <Login onLoginSuccess={this.handleLoginSuccess} login={app.api.user.login.bind()}/>
      </Layout>
      /* jshint ignore:end */
      );
  },

  renderErrorLayout:function(){
    return (
      /* jshint ignore:start */
      <Layout>
      <UserMessage message={this.state.userMessage}/>
      </Layout>
      /* jshint ignore:end */
      );
  },

  renderContent:function(){
    var routeName = this.state.routeName;

    if(this.state.authenticated){

      if (routes.messagesForAllTeams === routeName) {
        return this.renderMessagesForAllTeams();
      }
      else if (routes.messagesForSelectedTeam === routeName) {
        return this.renderMessagesForSelectedTeam();
      }
      else if(routes.messageThread === routeName){
        return this.renderMessageThread();
      }
      else if(routes.error === routeName){
        return this.renderErrorLayout();
      }

    } else {
      if(routes.error === routeName){
        return this.renderErrorLayout();
      }else{
        return this.renderLoginLayout();
      }
    }
  }
});

app.start = function() {
  var self = this;

  this.init(function() {

    //Make it touchable
    React.initializeTouchEvents(true);

    self.component = React.renderComponent(
      /* jshint ignore:start */
      <ClamShellApp />,
      /* jshint ignore:end */
      document.getElementById('app')
    );

    self.log('app started');
  });
};

app.init = function(callback) {

  this.api.user.loadSession(callback);
  callback();
};

module.exports = app;