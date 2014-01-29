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
 
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */

'use strict';

var React = require('react');
var Router = require('director').Router;
var bows = require('bows');
var _ = require('underscore');

//app components 
var Layout = require('./layout/Layout');
var ListNavBar = require('./components/ListNavBar');
var FooterBar = require('./components/FooterBar');
var MessageFooter = require('./components/MessageFooter');
var Login = require('./components/Login');
var MyGroupsPicker = require('./components/GroupsPicker');
var GroupConversations = require('./components/GroupConversations');
var MessageItemList = require('./components/MessageItemList');
var MessageForm = require('./components/MessageForm');

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
            messages: null,
            routeName: routes.login,
            authenticated: app.auth.isAuthenticated(),
            user: null,
            userGroupsMessages:null,
            selectedGroup: null,
            loggingOut: false
        };
    },

    componentDidMount: function () {

        console.log('setup ...');
        if (this.state.authenticated) {
            console.log('authenticated ...');
            this.fetchUserData();
            this.setState({routeName: routes.messagesForAllTeams});
        }
        //router
        var router = Router({
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
        var messageGroup = _.find(this.state.userGroupsMessages, function(group){ return groupId == group.id });

        var messagesInThread = _.where(messageGroup.messages, {rootmessageid: rootMessageId});

        var messagesOrderedByDate = _.sortBy(messagesInThread, function(message){ return message.timestamp });

        return messagesOrderedByDate;

    },

    //---------- App Handlers ----------

    handleLogout:function(){
        var self = this;
        app.auth.logout(function(){
            self.setState(self.initializeAppState());
        });
    },

    handleBack:function(){
        this.setState({routeName:routes.messagesForAllTeams});
    },

    handleLoginSuccess:function(){
        this.setState({authenticated: true});
        this.fetchUserData();
        this.setState({routeName:routes.messagesForAllTeams});
    },

    handleShowConversationThread:function(mostRecentMessageInThread){    

        //console.log('group: ',mostRecentMessageInThread.groupid);
        //console.log('root message: ',mostRecentMessageInThread.rootmessageid);

        var messages = this.messagesForThread(mostRecentMessageInThread.groupid,mostRecentMessageInThread.rootmessageid);
        this.setState({messages: messages,routeName:routes.messageThread});
    },

    handleStartingNewConversation:function(){
        this.setState({routeName:routes.startMessageThread});
    },

    handleStartConversation:function(e){
        //optimistically add to the existing messages
        console.log('send ['+e.text+'] ['+e.group+']');

        var updatedMessages = this.state.messages;

        this.setState({messages:updatedMessages});
        //show the thread
        console.log('show new conversation thread');
        this.handleShowConversationThread(e.group);
    },

    handleAddingToConversation:function(){
        console.log('add to existing converstaion');
    },

    handleGroupChanged:function(e){
        var group = _.find(this.state.userGroupsMessages, function(group){ return e.groupId == group.id });
        this.setState({routeName:routes.messagesForSelectedTeam,selectedGroup:[group]});
    },

    //---------- Rendering Layouts ----------

    render: function () {
        var content = this.renderContent();

        return (
            <div className="app">
                {content}
            </div>
        );
    },

    renderGroupConversationsLayout:function(){
        return (
            /* jshint ignore:start */
            <Layout>
                <ListNavBar title={this.state.selectedGroup[0].name} actionIcon='glyphicon glyphicon-log-out' onNavBarAction={this.handleLogout}>
                    <MyGroupsPicker groups={this.state.selectedGroup} onGroupPicked={this.handleGroupChanged} />
                </ListNavBar>
                <GroupConversations groups={this.state.selectedGroup} onThreadSelected={this.handleShowConversationThread} />
                <MessageFooter messagePrompt='Type a new note here ...' btnMessage='Post' onFooterAction={this.handleStartingNewConversation}/>
            </Layout>
            /* jshint ignore:end */
        );
    },

    renderAllGroupsConversationsLayout:function(){
        return (
            /* jshint ignore:start */
            <Layout>
                <ListNavBar title='All Notes' actionIcon='glyphicon glyphicon-log-out' onNavBarAction={this.handleLogout}>
                    <MyGroupsPicker groups={this.state.userGroupsMessages} onGroupPicked={this.handleGroupChanged} />
                </ListNavBar>
                <GroupConversations groups={this.state.userGroupsMessages} onThreadSelected={this.handleShowConversationThread} />
                <MessageFooter messagePrompt='Type a new note here ...' btnMessage='Post' onFooterAction={this.handleStartingNewConversation}/>
            </Layout>
            /* jshint ignore:end */
        );
    },

    renderConversationThreadLayout:function(){
        return (
            /* jshint ignore:start */
            <Layout>
                <ListNavBar title='Note in <group> team' actionIcon='glyphicon glyphicon-arrow-left' onNavBarAction={this.handleBack} />
                <MessageItemList messages={this.state.messages} />
                <MessageFooter messagePrompt='Type a comment here ...' btnMessage='Comment' onFooterAction={this.handleAddingToConversation}/>
            </Layout>
            /* jshint ignore:end */
        );
    },

    renderNewConversationLayout:function(){
        return (
            /* jshint ignore:start */
            <Layout>
                <ListNavBar title='New note for <group>' actionIcon='glyphicon glyphicon-arrow-left' onNavBarAction={this.handleBack}/>
                //<MessageForm groups={this.state.groups} onMessageSend={this.handleStartConversation}/>
                <MessageFooter messagePrompt='' btnMessage='Post' onFooterAction={this.handleStartConversation}/>
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

        if (this.state.authenticated && routeName === routes.messagesForAllTeams) {
            
            return this.renderAllGroupsConversationsLayout();
        }
        if (this.state.authenticated && routeName === routes.messagesForSelectedTeam) {
            
            return this.renderGroupConversationsLayout();
        }
        else if(this.state.authenticated && routeName === routes.messageThread){
            
            return this.renderConversationThreadLayout();
        }
        else if(this.state.authenticated && routeName === routes.startMessageThread){

            return this.renderNewConversationLayout();
        }
        else{
            
            return this.renderLoginLayout();
        }
    },

    //load the user and then thier groups and those groups messages
    fetchUserData: function() {
        var self = this;
        app.api.user.get(function(err, user) {
            self.setState({user: user});
            app.api.groups.get(user,function(err, userGroupsMessages) {
                self.setState({userGroupsMessages:userGroupsMessages});
            });
        });
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