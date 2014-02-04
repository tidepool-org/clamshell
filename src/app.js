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
var MyGroupsPicker = require('./components/GroupsPicker');
var GroupConversations = require('./components/GroupConversations');
var MessageItemList = require('./components/MessageItemList');
/*jshint unused:false */

//core functionality
var auth = require('./core/auth');
var api = require('./core/api');
var user = require('./core/user');

var app = {
  log: bows('App'),
  user:user,
  api:api,
  auth:auth
};

var routes = {
  login:'login',
  messagesForAllTeams:'allGroupsConversations',
  messagesForSelectedTeam:'groupConversations',
  messageThread: 'conversationThread',
  startMessageThread:'newConversation'
};

require('./ClamShellApp.css');

var ClamShellApp = React.createClass({
  getInitialState: function () {
    return this.initializeAppState();
  },

  //starting state for the app when first used or after logout
  initializeAppState : function(){
    return {
      routeName: routes.login,
      previousRoute: null,
      authenticated: app.auth.isAuthenticated(),
      user: null,
      userGroupsWithMessages:null,
      selectedGroup: null,
      loggingOut: false
    };
  },

  componentDidMount: function () {

    console.log('setup ...');
    if (this.state.authenticated) {
      console.log('authenticated ...');
      this.fetchUserData();
      var currentRoute = this.state.routeName;
      this.setState({routeName: routes.messagesForAllTeams, previousRoute : currentRoute});
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

  // ---------- Utility Methods ----------

  messagesForThread:function(groupId,rootMessageId){

    //var messageGroup = _.find(this.state.groups, function(group){ return groupId == group.id });
    var messageGroup = _.find(this.state.userGroupsWithMessages, function(group){ return groupId == group.id; });
    var messagesInThread = _.where(messageGroup.messages, {rootmessageid: rootMessageId});
    var messagesOrderedByDate = _.sortBy(messagesInThread, function(message){ return message.timestamp; });

    return messagesOrderedByDate;

  },

  //load the user and then thier groups and those groups messages
  fetchUserData: function() {
    var self = this;
    app.api.user.get(function(err, user) {
      self.setState({user: user});
      app.api.groups.get(user,function(err, userGroupsWithMessages) {
        self.setState({userGroupsWithMessages:userGroupsWithMessages});
      });
    });
  },

  //---------- App Handlers ----------

  handleLogout:function(){
    var self = this;
    app.auth.logout(function(){
      self.setState(self.initializeAppState());
    });
  },

  handleBack:function(){
    var previousRoute = this.state.previousRoute;
    this.setState({routeName:previousRoute});
  },

  handleLoginSuccess:function(){
    this.setState({authenticated: true});
    this.fetchUserData();

    var currentRoute = this.state.routeName;
    this.setState({routeName: routes.messagesForAllTeams, previousRoute : currentRoute});
  },

  handleShowConversationThread:function(mostRecentMessageInThread){

    //console.log('group: ',mostRecentMessageInThread.groupid);
    //console.log('root message: ',mostRecentMessageInThread.rootmessageid);

    var messages = this.messagesForThread(mostRecentMessageInThread.groupid,mostRecentMessageInThread.rootmessageid);

    var currentRoute = this.state.routeName;
    this.setState({messages: messages,routeName:routes.messageThread, previousRoute : currentRoute});
  },

  handleStartingNewConversation:function(){
    var currentRoute = this.state.routeName;
    this.setState({routeName:routes.startMessageThread,previousRoute : currentRoute});
  },

  handleStartConversation:function(e){
    //optimistically add to the existing messages
    console.log('send ['+e.text+'] ');

    var updatedMessages = this.state.messages;

    this.setState({messages:updatedMessages});
    //show the thread
    console.log('show new conversation thread');
    this.handleShowConversationThread(e.group);
  },

  handleAddingToConversation:function(e){
    console.log('send ['+e.text+']');
    console.log('add to existing converstaion');
  },

  handleGroupChanged:function(e){
    var group = _.find(this.state.userGroupsWithMessages, function(group){ return e.groupId == group.id; });
    var currentRoute = this.state.routeName;
    this.setState({routeName:routes.messagesForSelectedTeam,selectedGroup:[group],previousRoute : currentRoute});
  },

  //---------- Rendering Layouts ----------

  render: function () {
    var content = this.renderContent();

    return (
      /* jshint ignore:start */
      <div className="app">
      {content}
      </div>
      /* jshint ignore:end */
      );
  },

  renderMessagesForSelectedTeam:function(){
    return (
      /* jshint ignore:start */
      <Layout>
      <ListNavBar title={this.state.selectedGroup[0].name} actionIcon='glyphicon glyphicon-arrow-left' onNavBarAction={this.handleBack}>
      <MyGroupsPicker groups={this.state.selectedGroup} onGroupPicked={this.handleGroupChanged} />
      </ListNavBar>
      <GroupConversations groups={this.state.selectedGroup} onThreadSelected={this.handleShowConversationThread} />
      <MessageFooter messagePrompt='Type a new note here ...' btnMessage='Post' onFooterAction={this.handleStartingNewConversation}/>
      </Layout>
      /* jshint ignore:end */
      );
  },

  renderMessagesForAllTeams:function(){
    return (
      /* jshint ignore:start */
      <Layout>
      <ListNavBar title='All Notes' actionIcon='glyphicon glyphicon-log-out' onNavBarAction={this.handleLogout}>
      <MyGroupsPicker groups={this.state.userGroupsWithMessages} onGroupPicked={this.handleGroupChanged} />
      </ListNavBar>
      <GroupConversations groups={this.state.userGroupsWithMessages} onThreadSelected={this.handleShowConversationThread} />
      </Layout>
      /* jshint ignore:end */
      );
  },

  renderMessageThread:function(){
    return (
      /* jshint ignore:start */
      <Layout>
      <ListNavBar title='Note in {<group>} team' actionIcon='glyphicon glyphicon-arrow-left' onNavBarAction={this.handleBack} />
      <MessageItemList messages={this.state.messages} />
      <MessageFooter messagePrompt='Type a comment here ...' btnMessage='Comment' onFooterAction={this.handleAddingToConversation}/>
      </Layout>
      /* jshint ignore:end */
      );
  },

  renderStartMessageThread:function(){
    return (
      /* jshint ignore:start */
      <Layout>
      <ListNavBar title='New note for ....' actionIcon='glyphicon glyphicon-arrow-left' onNavBarAction={this.handleBack}>
      <MyGroupsPicker groups={this.state.userGroupsWithMessages} onGroupPicked={this.handleGroupChanged} />
      </ListNavBar>
      <div ref='' className="list-group-item row">
      <div className="col-xs-3">
      <img ref='authorImage' className="media-object img-circle" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAACMCAYAAACuwEE+AAAFiElEQVR4Xu3XSUtcaxCH8XLAWRRFxIWKE7gRx6Cigl/deQRxQBQcl6JpJXEeQ73QYlyIdS373q77nFVMquuk/vXzPacLMpnMi3CRwCcTKADMJ5OiLCUAGCCYEgCMKS6KAYMBUwKAMcVFMWAwYEoAMKa4KAYMBkwJAMYUF8WAwYApAcCY4qIYMBgwJQAYU1wUAwYDpgQAY4qLYsBgwJQAYExxUQwYDJgSAIwpLooBgwFTAoAxxUUxYDBgSgAwprgoBgwGTAkAxhQXxYDBgCkBwJjiohgwGDAlABhTXBQDBgOmBABjiotiwGDAlABgTHFRDBgMmBIAjCkuigGDAVMCgDHFRTFgMGBKADCmuCgGDAZMCQDGFBfFgMGAKQHAmOKiGDAYMCUAGFNcFAMGA6YEAGOKi2LAYMCUAGBMcVEMGAyYEgCMKS6KAYMBUwKAMcVFMWAwYEoAMKa4KAYMBkwJAMYUF8WAwYApAcCY4qIYMBgwJQAYU1wUAwYDpgQAY4qLYsBgwJRA3oM5PDyU4+NjGRkZkbKysr+Gz2Qysr29LRUVFdLf3y8FBQXy8vIiW1tbcnZ2ln5ub2+XlpaWT4eW6/t9+j+Wo8K8BXNxcSEK4uDgIEU1NjYm5eXlr7EpjKmpKXl8fJSSkhIZHx+XwsJCWV9fl9PTUyktLZX7+/sEqKenRxobGz+MPNf3y9H+zbfJWzDT09Np4dlLQbw9Yfb29uTo6Cj9s/69gnp6ehL9nMKZmJhI4BRQbW2tdHd3y8bGhhQVFcnAwIBcXl7Kzs5OgtXX1yezs7Ou9xsaGjIv67/wgbwFoyeHPlIWFxfl5uYmnSBZMPrz3NxcetT8+vVLrq+vE5CHh4e0+OLi4vRzFpD+rJ9fW1uT8/Nzqaurk9vb2/S5rq4uaW1tTSeV9/0Ubr5deQsmG7SC0dPgLZiVlZX0d5OTk7K8vCx3d3evJ4qiqK+vT+80ikBPHH1k6QmUBfX8/Jza19TUyI8fP/7aqef9FGC+XeHA6LvG6uqqVFZWSnNzs+zv74sC6OzslIaGhnTy6GPm7SMqe8Lob7y+1Opn9BoeHpbq6uoPwXz1foDJcQLvf+N//vyZHi3vL8Wgp1D2kaR/1lNITyD9FjU6OppgzczMpJNHLwXW29v7IZiv3I8TJsdY9HYLCwtydXX1+kjSpWdfhhWJPp4UgJ4W+o4zPz+f3k2amprk9+/fCU1HR4e0tbXJ5uamnJycSFVVVarRXu+/QXne71+I68u3zPtHkp4Q+mL7/lvS23ccBaOPIP2NVlxLS0sJQ/Y9ZXBwMOFRXFqjL8QKZ3d39/UFWb896eV1v3x84dX58x7MP/mVUSx6guilp8l3X7m+33fO878E852BRu8NmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm/3B89OPbW5/bE0AAAAAElFTkSuQmCC"/>
      </div>
      <div className="col-xs-9">
      <h4 ref='authorName' className="list-group-item-heading">{this.state.user.name} > TODO</h4>
      </div>
      </div>
      <MessageFooter btnMessage='Post' onFooterAction={this.handleStartConversation}/>
      </Layout>
      /* jshint ignore:end */
      );
  },

  renderLoginLayout:function(){
    return (
      /* jshint ignore:start */
      <Layout>
      <Login onLoginSuccess={this.handleLoginSuccess} login={app.auth.login.bind(app.auth)}/>
      </Layout>
      /* jshint ignore:end */
      );
  },

  //render based on route
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
      else if(routes.startMessageThread === routeName){
        return this.renderStartMessageThread();
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
  var self = this;

  function initApi() {
    self.api.init();
    initAuth();
  }

  function initAuth() {
    //console.log('authenticating ...');
    self.auth.init(callback);
    callback();
  }

  initApi();
};

module.exports = app;