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
// Attach React to window to activate "React DevTools" Chrome extension
window.React = React;
var _ = require('lodash');
var bows = require('bows');

require('./core/core.less');
require('./app.less');

var config = require('./config');

// Eliminate 300ms delay for click events on touch screens
// Note: FastClick doesn't export as CommonJS first,
// so disable AMD to fix that
var attachFastClick = require('imports?define=>false!fastclick');
attachFastClick(document.body);

var router = require('./appRouter')();

/*jshint unused:true */
var Layout = require('./layout/Layout');
var Notification = require('./components/notification/Notification');
var Header = require('./components/header/Header');
var MessageForm = require('./components/form/MessageForm');
var Login = require('./components/login/Login');
var LoginFooter = require('./components/login/LoginFooter');
var TeamPicker = require('./components/menu/TeamPicker');
var LoggedInAs = require('./components/menu/LoggedInAs');
/*jshint unused:false */

var app = {
  log : bows('App'),
  api : require('./core/apiSchema')(bows),
  dataHelper : require('./core/userDataHelper'),
  routes : router.routes,
  userMessages : require('./userMessages')
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
      routeName : null,
      setupComplete : false,
      loadingData : true,
      previousRoute : null,
      authenticated : null,
      loggedInUser : null,
      selectedUser : null,
      notification : null,
      showingMenu : false,
      lastNoteAdded: null,
      selectedForEdit: null
    };
  },

  /**
   * Data integration for the app
   */
  attachPlatform : function(cb){
    app.log('attaching to platform ...');

    var userSchema = require('./core/userSchema');

    if(app.mock){

      var mockApi = app.mock(app.api, userSchema);

      mockApi.initialize(function(){
        app.log('Initialized Mock API');
        app.trackMetric = app.api.metrics.track.bind(app.api.metrics);
        return cb();
      });

    } else {

      var tidepoolApi = require('tidepool-platform-client')({
        host: config.API_HOST,
        log: app.log,
        localStore: window.localStorage,
        metricsSource: 'clamshell',
        metricsVersion: config.VERSION
      });

      tidepoolApi.initialize(function() {
        app.log('Initialized API');
        require('./core/tidepool_platform')(
          app.api,
          userSchema,
          tidepoolApi,
          config
        );
        app.trackMetric = app.api.metrics.track.bind(app.api.metrics);
        return cb();
      });
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

    this.attachPlatform(function(){
      this.attachHandlers();
      this.attachRouter();

      app.api.user.isAuthenticated(function(authenticated){
        if(authenticated){
          this.setState({ authenticated : true, setupComplete : true });
          app.api.user.refresh(function(error){
            if(error){
              this.handleError(error);
              return;
            }
            this.loadUserData();
          }.bind(this));

        } else {
          this.setState({ routeName : app.routes.login, setupComplete : true });
        }
      }.bind(this));
    }.bind(this));
  },
  /**
   * Load the logged in users data for all the teams that are a part of
   */
  loadUserData: function(){
    this.setState({ loadingData : true });

    app.api.user.teams.get(function(error){
      app.log('loaded user teams');
      if(error){
        this.handleError(error);
        return;
      }
      this.setState({
        loadingData : false,
        loggedInUser : app.api.user.get(),
        selectedUser : app.api.user.get()  //default to the selected user
      // Call showUserData only after state has been updated
      }, this.showUserData);
    }.bind(this));
  },
  componentDidUpdate: function(prevProps, prevState) {
    var state = this.state;

    if (this.changedRoute(prevState, state)) {
      app.log('changed route, scroll to top');
      this.scrollToContentTop();
    }

    if (this.newNoteAdded(prevState, state)) {
      app.log('new note added, scroll to top');
      this.scrollToContentTop();
    }

  },
  scrollToContentTop: function() {
    // HACK: on iOS Safari, keyboard needs to disappear for scroll positioning
    // to work as expected, so use `setTimeout` to not call this immediately
    // (timeout value can be very small, just need to postpone in JS event loop)
    setTimeout(this.refs.layout.scrollToContentTop, 10);
  },
  scrollToContentBottom: function() {
    setTimeout(this.refs.layout.scrollToContentBottom, 10);
  },
  changedRoute: function(prevState, state) {
    return (state.routeName !== prevState.routeName);
  },
  newNoteAdded: function(prevState, state) {
    var prevAddedNote = prevState.lastNoteAdded  || {};
    var addedNote = state.lastNoteAdded  || {};

    if (addedNote.id !== prevAddedNote.id) {
      return true;
    }

    return false;
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
    if (this.hasCompletedLoadingData()) {
      this.setState({
        selectedUser : this.state.loggedInUser
      });
      return;
    }
  },

  //---------- Rendering Layouts ----------
  render: function () {
    var routeName = this.state.routeName;
    if(this.state.authenticated && this.hasCompletedLoadingData()){
      return this.renderAddNote();
    }
    if(app.routes.login === routeName && this.state.setupComplete){
      return this.renderLogin();
    }
    return this.renderStartup();
  },
  renderAddNote:function(){

    var careTeamName = app.dataHelper.formatTeamFullName(this.state.selectedUser.profile);

    var header = this.renderHeader({
      title: careTeamName,
      leftIcon: 'logout',
      onLeftAction: this.handleLogout
    });

    var content = (
      /* jshint ignore:start */
      <div className='note'>
        <MessageForm
          messagePrompt={app.userMessages.NOTE_PROMPT}
          saveBtnText={app.userMessages.SAVE}
          words={app.api.user.getWordbankWords()}
          onSubmit={this.handleStartConversation}/>
      </div>
      /* jshint ignore:end */
      );
    return this.renderLayout(content, {header: header});
  },
  renderLogin:function(){
    var footer = LoginFooter();

    var content = (
      /* jshint ignore:start */
      <div className='login-screen'>
        <Login
            onLoginSuccess={this.handleLoginSuccess}
            login={app.api.user.login.bind()}
            errorLogging={app.api.errors.log.bind()} />
      </div>
      /* jshint ignore:end */
      );

    return this.renderLayout(content, {footer: footer});
  },
  renderStartup:function(){
    var content;
    /* jshint ignore:start */
    content = (
      <div className='startup'>
        Loading...
      </div>
      );
    /* jshint ignore:end */

    return this.renderLayout(content);
  },
  renderLayout:function(content, options){
    options = options || {};
    var header = options.header;
    var footer = this.renderMenuFooter() || options.footer;
    var notification = this.renderNotification();
    var menu = this.renderMenu();

    return (
      /* jshint ignore:start */
      <Layout
        notification={notification}
        header={header}
        menu={menu}
        footer={footer}
        ref='layout'>
        {content}
      </Layout>
      /* jshint ignore:end */
    );
  },
  renderNotification: function() {
    if (!this.state.notification) {
      return null;
    }

    return Notification({
      notification: this.state.notification,
      onClose: this.handleNotificationDismissed
    });
  },
  renderHeader: function(props) {
    props = props || {};

    if (this.state.showingMenu) {
      _.assign(props, {
        // Since menu takes up whole screen currently,
        // change title to not confuse user
        title: app.userMessages.MENU,
        // Hide left action when menu is open
        leftIcon: null,
        onLeftAction: null,
        rightIcon: 'up',
        onRightAction: this.handleCloseMenu
      });
    }
    else {
      _.assign(props, {
        rightIcon: 'down',
        onRightAction: this.handleOpenMenu
      });
    }

    return Header(props);
  },
  renderMenu: function() {
    if (!this.state.showingMenu) {
      return null;
    }

    return (
      /* jshint ignore:start */
      <div className='menu'>
        <div className='menu-teampicker-instructions'>
          {app.userMessages.SELECT_TO_VIEW}
        </div>
        <TeamPicker
          loggedInUser={this.state.loggedInUser}
          onUserPicked={this.handleUserChanged} />
      </div>
      /* jshint ignore:end */
    );
  },
  renderMenuFooter: function() {
    if (!this.state.showingMenu) {
      return null;
    }

    return LoggedInAs({
      user: this.state.loggedInUser,
      onLogout: this.handleLogout
    });
  }
});

app.useMock = function(mock) {
  this.mock = mock;
};

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
