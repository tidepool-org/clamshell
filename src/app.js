/**
 * @jsx React.DOM
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

var Layout = require('./layout/Layout');

var ListNavBar = require('./components/ListNavBar');
var FooterBar = require('./components/FooterBar');
var MessageFooter = require('./components/MessageFooter');
var Login = require('./components/Login');

var MyGroupsPicker = require('./components/GroupsPicker');

var GroupConversations = require('./components/GroupConversations');
var MessageItemList = require('./components/MessageItemList');
var MessageForm = require('./components/MessageForm');

var auth = require('./core/auth');
var api = require('./core/api');
var user = require('./core/user');

var app = {
    log: bows('App'),
    user:user,
    api:api,
    auth:auth
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
            routeName: 'login',
            authenticated: app.auth.isAuthenticated(),
            user: null,
            groups: null,
            loggingOut: false
        };
    },

    componentDidMount: function () {

        console.log('setup ...');
        if (this.state.authenticated) {
            console.log('authenticated ...');
            this.fetchUserData();
            this.setState({routeName:'groupConversations'});
        }
        //router
        var router = Router({
            '/': this.setState.bind(this, {routeName: 'login'}),
            '/groupConversations': this.setState.bind(this, {routeName: 'groupConversations'}),
            '/conversationThread': this.setState.bind(this, {routeName: 'conversationThread'}),
            '/newConversation': this.setState.bind(this, {routeName: 'newConversation'})
        });
        router.init();
    },

    // ---------- Utility Methods ----------
    messagesForThread:function(groupId,rootMessageId){

        var messageGroup = _.find(this.state.groups, function(group){ return groupId == group.id });

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
        this.setState({routeName:'groupConversations'});
    },

    handleLoginSuccess:function(){
        this.setState({authenticated: true});
        this.fetchUserData();
        this.setState({routeName:'groupConversations'});
    },

    handleShowConversationThread:function(mostRecentMessageInThread){    

        console.log('group: ',mostRecentMessageInThread.groupid);
        console.log('root message: ',mostRecentMessageInThread.rootmessageid);

        var messages = this.messagesForThread(mostRecentMessageInThread.groupid,mostRecentMessageInThread.rootmessageid);

        this.setState({messages: messages,routeName:'conversationThread'});
    },

    handleStartingNewConversation:function(){
        this.setState({routeName:'newConversation'});
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

    handleGroupChanged:function(){
        console.log('change the selected group');
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
                <ListNavBar title='All Notes' actionIcon='glyphicon glyphicon-log-out' onNavBarAction={this.handleLogout}>
                    <MyGroupsPicker groups={this.state.groups} onGroupPicked={this.handleGroupChanged} />
                </ListNavBar>
                <GroupConversations groups={this.state.groups} onThreadSelected={this.handleShowConversationThread} />
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
                <MessageFooter messagePrompt='Type a comment here ...' btnMessage='Post' onFooterAction={this.handleAddingToConversation}/>
            </Layout>
            /* jshint ignore:end */
        );
    },

    renderNewConversationLayout:function(){
        return (
            /* jshint ignore:start */
            <Layout>
                <ListNavBar title='New note for <group>' actionIcon='glyphicon glyphicon-arrow-left' onNavBarAction={this.handleBack}/>
                <MessageForm groups={this.state.groups} onMessageSend={this.handleStartConversation}/>
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

    renderContent:function(){
        var routeName = this.state.routeName;

        if (this.state.authenticated && routeName === 'groupConversations') {
            
            return this.renderGroupConversationsLayout();
        }
        else if(this.state.authenticated && routeName === 'conversationThread'){
            
            return this.renderConversationThreadLayout();
        }
        else if(this.state.authenticated && routeName === 'newConversation'){

            return this.renderNewConversationLayout();
        }
        else{
            
            return this.renderLoginLayout();
        }
    },

    fetchUserData: function() {
        var self = this;
        console.log('getting user');
        app.api.user.get(function(err, user) {
            self.setState({user: user});

            app.api.groups.get(user,function(err, groups) {
                console.log('getting user groups and hacking messages');
                self.setState({groups: groups, messages:groups[0].messages});
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