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
var bows = require('bows');

var config = window.appConfig;

var router = require('./appRouter')();

/*jshint unused:true */
var Layout = require('./layout/Layout');
var ListNavBar = require('./components/header/ListNavBar');
var MessageForm = require('./components/form/MessageForm');
var Login = require('./components/login/Login');
var TeamPicker = require('./components/header/TeamPicker');
var TeamNotes = require('./components/notes/TeamNotes');
var NoteThread = require('./components/notes/NoteThread');
/*jshint unused:false */

require('./app.css');

//core functionality
var api = require('./core/api')(bows);

var app = {
  log : bows('App'),
  api : api,
  dataHelper : require('./core/userDataHelper'),
  routes : router.routes
};

window.app = app;

var ClamShellApp = React.createClass({
  getInitialState: function () {
    app.log('initializing ...');
    return this.initializeAppState();
  },

  //starting state for the app when first used or after logout
  initializeAppState : function(){
    return {
      routeName : app.routes.login,
      setupComplete : false,
      loadingData : true,
      previousRoute : null,
      authenticated : null,
      loggedInUser : null,
      selectedUser : null,
      selectedThread : null,
      notification : null
    };
  },
  /**
   * Data integrration for the app
   */
  attachPlatform : function(){
    app.log('attaching to platform ...');

    if(config.demo){
      require('./core/mock')(app.api);
    } else {
      require('./core/tidepool_platform')(
        app.api,
        require('tidepool-platform-client')({host:config.apiHost},api.log)
      );
    }
  },
  /**
   * Handlers for the app
   */
  attachHandlers : function(){
    app.log('attaching handlers ...');
    require('./appHandlers')(this,app);
  },
  /**
   * Router for the app
   */
  attachRouter : function(){
    app.log('attaching router ...');
    router.init(this);
  },
  componentDidMount: function () {

    app.log('setup ...');

    this.attachPlatform();
    this.attachHandlers();
    this.attachRouter();

    this.setState({setupComplete : true});

    api.user.isAuthenticated(function(authenticated){
      if(authenticated){
        this.setState({ authenticated : true });
        this.loadUserData();
      } else {
        this.setState({ routeName : app.routes.login });
      }
    }.bind(this));
  },
  /**
   * Load the logged in users data for all the teams that are a part of
   */
  loadUserData: function(){

    this.setState({ loadingData : true });

    api.user.teams.get(function(error){
      app.log('loaded user teams');
      if(error){
        this.handleError(error);
        return;
      }
      this.setState({
        loadingData : false,
        loggedInUser : app.api.user.get()
      // Call showUserData only after state has been updated
      }, this.showUserData);
    }.bind(this));

  },
  /**
   * Do we have other teams the logged in user is part of?
   */
  userHasTeams:function(){
    var teams = this.state.loggedInUser && this.state.loggedInUser.teams;
    return (teams && teams.length > 0);
  },
  /**
   * Have we finished loading data?
   */
  hasCompletedLoadingData:function(){
    return !this.state.loadingData;
  },
  /**
   * Show the logged in users data for all the teams that are a part of
   */
  showUserData: function(){
    if (this.hasCompletedLoadingData() && this.userHasTeams()) {
      app.log('user has other teams also');
      this.setState({
        routeName : app.routes.messagesForAllTeams
      });
      return;
    } else if(this.hasCompletedLoadingData()){
      app.log('just users team');
      this.setState({
        selectedUser : this.state.loggedInUser,
        routeName : app.routes.messagesForSelectedTeam
      });
      return;
    }
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
  renderNavBar:function(title, icon, actionHandler){
    return (
      /* jshint ignore:start */
      <ListNavBar title={title} actionIcon={icon} onNavBarAction={actionHandler} />
      /* jshint ignore:end */
    );
  },
  renderNavBarWithTeamPicker:function(title, icon, actionHandler){
    return (
      /* jshint ignore:start */
      <ListNavBar title={title} actionIcon={icon} onNavBarAction={actionHandler}>
        <TeamPicker loggedInUser={this.state.loggedInUser} onUserPicked={this.handleUserChanged} />
      </ListNavBar>
      /* jshint ignore:end */
    );
  },
  renderMessagesForSelectedTeam:function(){

    var careTeamName = app.dataHelper.formatFullName(this.state.selectedUser.profile);

    var navBar = this.renderNavBar(careTeamName,'logout-icon',this.handleLogout);

    if(this.userHasTeams()){
      navBar = this.renderNavBarWithTeamPicker(careTeamName,'back-icon',this.handleBack);
    }

    /* jshint ignore:start */
    return (
      <Layout
        notification={this.state.notification}
        onDismissNotification={this.handleNotificationDismissed}>
        {navBar}
        <MessageForm
          messagePrompt='Type a new note here ...'
          btnMessage='Post'
          onFooterAction={this.handleStartConversation} />
        <TeamNotes
          notes={this.state.selectedUser.notes}
          onThreadSelected={this.handleShowConversationThread} />
      </Layout>
    );
    /* jshint ignore:end */
  },
  renderMessagesForAllTeams:function(){

    var navBar = this.renderNavBarWithTeamPicker('All Notes','logout-icon',this.handleLogout);

    /* jshint ignore:start */
    return (
      <Layout
        notification={this.state.notification}
        onDismissNotification={this.handleNotificationDismissed}>
        {navBar}
        <TeamNotes
          notes={app.dataHelper.getAllNotesForLoggedInUser(this.state.loggedInUser)}
          onThreadSelected={this.handleShowConversationThread} />
      </Layout>
      );
    /* jshint ignore:end */
  },
  renderMessageThread:function(){
    var careTeamName = app.dataHelper.formatFullName(this.state.selectedUser.profile);

    var navBar = this.renderNavBar(careTeamName,'back-icon',this.handleBack);

    return (
      /* jshint ignore:start */
      <Layout
        notification={this.state.notification}
        onDismissNotification={this.handleNotificationDismissed}>
      {navBar}
      <NoteThread messages={this.state.selectedThread} />
      <MessageForm
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
      <Layout
        notification={this.state.notification}
        onDismissNotification={this.handleNotificationDismissed}>
        <Login
          onLoginSuccess={this.handleLoginSuccess}
          login={app.api.user.login.bind()} />
      </Layout>
      /* jshint ignore:end */
      );
  },

  renderStartupLayout:function(){
    return (
      /* jshint ignore:start */
      <Layout />
      /* jshint ignore:end */
      );
  },

  renderContent:function(){
    var routeName = this.state.routeName;

    if(this.state.authenticated){

      if (app.routes.messagesForAllTeams === routeName) {
        return this.renderMessagesForAllTeams();
      }
      else if (app.routes.messagesForSelectedTeam === routeName) {
        return this.renderMessagesForSelectedTeam();
      }
      else if(app.routes.messageThread === routeName){
        return this.renderMessageThread();
      }
    }
    if(app.routes.login === routeName && this.state.setupComplete){
      return this.renderLoginLayout();
    }
    return this.renderStartupLayout();
  }
});

app.start = function() {

  //Make it touchable
  React.initializeTouchEvents(true);
  this.component = React.renderComponent(
    /* jshint ignore:start */
    <ClamShellApp />,
    /* jshint ignore:end */
    document.getElementById('app')
  );

};

module.exports = app;
