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
var _ = require('underscore');

//app components
/*jshint unused:true */
var Layout = require('./layout/Layout');
var ListNavBar = require('./components/ListNavBar');
var MessageFooter = require('./components/MessageFooter');
var Login = require('./components/Login');
var TeamPicker = require('./components/TeamPicker');
var TeamNotes = require('./components/TeamNotes');
var NoteThread = require('./components/NoteThread');
var UserMessage = require('./components/UserMessage');
/*jshint unused:false */

//core functionality
var api = require('./core/api');

if(false){
  console.log('mock setup');
  require('./core/mock')(api);
} else {
  console.log('production setup');
  //require('./core/platform')(api,'https://devel-api.tidepool.io',window.superagent);
  require('./core/platform')(api,'http://localhost:8009',window.superagent);
}

var app = {
  log : bows('App'),
  api : api,
  userHelper : require('./core/userHelper'),
  teamHelper : require('./core/teamHelper'),
  notesHelper : require('./core/notesHelper')
};

var routes = {
  login:'login',
  messagesForAllTeams:'allGroupsConversations',
  messagesForSelectedTeam:'groupConversations',
  messageThread: 'conversationThread',
  startMessageThread:'newConversation'
};

require('./app.css');

var ClamShellApp = React.createClass({
  getInitialState: function () {
    return this.initializeAppState();
  },

  //starting state for the app when first used or after logout
  initializeAppState : function(){
    return {
      routeName : routes.login,
      previousRoute : null,
      authenticated : app.api.user.isAuthenticated(),
      loggedInUser : null,
      userGroupsData : null,
      selectedGroup : null,
      selectedThread : null,
      loggingOut : false
    };
  },

  componentDidMount: function () {

    console.log('setup ...');
    if (this.state.authenticated) {
      console.log('authenticated ...');
      this.fetchUserData(function(){
        this.setState(
          {routeName: routes.messagesForAllTeams,
           previousRoute : this.state.routeName}
        );
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
  },

  //load the user and then thier groups and those groups messages
  fetchUserData: function(callback) {
    var self = this;

    api.user.team.get(function(err, team) {
      if(err){
        console.log(err);
        return;
      }
      self.setState({userGroupsData:[team]});
      callback();
    });
  },

  fetchPatientsData: function(callback) {
    var self = this;
    api.user.patients.get(function(err, patients) {
      if(err){
        console.log(err);
        return;
      }
      var all = self.state.userGroupsData.concat(patients);
      self.setState({userGroupsData:all});
      callback();
    });
  },

  //---------- App Handlers ----------

  handleLogout:function(){
    var self = this;
    console.log('## TODO - handleLogout ##');
    /*
    app.auth.logout(function(){
      self.setState(self.initializeAppState());
    });
*/
  },

  handleBack:function(){
    var previousRoute = this.state.previousRoute;
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
    
    var team = _.find(this.state.userGroupsData, 
      function(group){ 
        return mostRecentMessageInThread.groupid === group.id; 
      }
    );

    var thread = app.teamHelper.getThread(team,messagesId);

    this.setState(
      {selectedThread : thread,
       selectedGroup : team,
      routeName : routes.messageThread,
      previousRoute : this.state.routeName}
    );
  },

  handleStartingNewConversation:function(){
    this.setState({routeName:routes.startMessageThread,previousRoute : this.state.routeName});
  },

  handleStartConversation:function(note){
//TODO: sort this out
    var startThread = {
      userid : this.state.loggedInUser.userid,
      groupid : this.state.selectedGroup.id,
      timestamp : new Date(),
      messagetext : note.text
    };

    console.log('new thread: ',startThread);
//TODO: sort this out
    this.setState(
      {routeName:routes.messageThread,
      selectedThread: [startThread],
      previousRoute : this.state.routeName}
    );

  },

  handleAddingToConversation:function(note){
    console.log('reply ['+note.text+']');

    //TODO: sort this out
    var thread = this.state.selectedThread;
    var parentId = app.notesHelper.getParentMessageId(thread);

    var comment = {
      parentmessage : parentId,
      userid : this.state.loggedInUser.userid,
      groupid : this.state.selectedGroup.id,
      timestamp : new Date(),
      messagetext : note.text
    };

    console.log('reply: ',comment);
    app.api.notes.reply(comment,function(error){
      console.log('reply added ');
    });

    thread.push(comment);

    this.setState({selectedThread: thread});

  },

  handleGroupChanged:function(e){
    var group = _.find(
      this.state.userGroupsData, function(group){
        return e.groupId == group.id;
      });

    this.setState(
      {routeName:routes.messagesForSelectedTeam,
      selectedGroup:[group],
      previousRoute : this.state.routeName}
    );
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
      <ListNavBar title={this.state.selectedGroup.id} actionIcon='glyphicon glyphicon-arrow-left' onNavBarAction={this.handleBack}>
      <TeamPicker groups={this.state.userGroupsData} onGroupPicked={this.handleGroupChanged} />
      </ListNavBar>
      <TeamNotes groups={this.state.selectedGroup} onThreadSelected={this.handleShowConversationThread} />
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
      <ListNavBar title='All Notes' actionIcon='glyphicon glyphicon-log-out' onNavBarAction={this.handleLogout}>
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
      <ListNavBar title={this.state.selectedGroup.id} actionIcon='glyphicon glyphicon-arrow-left' onNavBarAction={this.handleBack} />
      <NoteThread messages={this.state.selectedThread} />
      <MessageFooter
        messagePrompt='Type a comment here ...'
        btnMessage='Comment'
        onFooterAction={this.handleAddingToConversation} />
      </Layout>
      /* jshint ignore:end */
      );
  },

  renderLoginLayout:function(){
    return (
      /* jshint ignore:start */
      <Layout>
      <Login onLoginSuccess={this.handleLoginSuccess} login={app.api.user.login.bind(app.userHelper)}/>
      </Layout>
      /* jshint ignore:end */
      );
  },

  renderErrorLayout:function(){
    return (
      /* jshint ignore:start */
      <Layout>
      <UserMessage login={this.state.userMessage}/>
      </Layout>
      /* jshint ignore:end */
      );
  },

  //render layout based on route
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

    } else {
      return this.renderLoginLayout();
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

    self.log('App started');
  });
};

app.init = function(callback) {
  callback();
  /*
  var self = this;

  function initApi() {
    self.api.init();
    initAuth();
  }

  function initAuth() {
    //console.log('authenticating ...');
    self.api.user.isAuthenticated(callback);
    callback();
  }

  initApi();*/
};

module.exports = app;