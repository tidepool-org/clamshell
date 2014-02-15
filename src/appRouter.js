
'use strict';
module.exports = function(app) {

  var Router = require('director').Router;

  app.routes = {
    login:'login',
    messagesForAllTeams:'allGroupsConversations',
    messagesForSelectedTeam:'groupConversations',
    messageThread: 'conversationThread',
    startMessageThread:'newConversation'
  };

  return {
    init : function(app){
      var router = new Router({
        '/': app.setState.bind(app, {routeName: routes.login}),
        '/allGroupsConversations': app.setState.bind(app, {routeName: routes.messagesForAllTeams}),
        '/groupConversations': app.setState.bind(app, {routeName: routes.messagesForSelectedTeam}),
        '/conversationThread': app.setState.bind(app, {routeName: routes.messageThread}),
        '/newConversation': app.setState.bind(app, {routeName: routes.startMessageThread})
      });
      router.init();
    }
  };
};