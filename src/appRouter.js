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

module.exports = function() {

  return {
    /**
     * The routes we handle
     */
    routes : {
      login : 'login',
      message : 'message',
      messagesForAllTeams : 'allTeams',
      messagesForSelectedTeam : 'usersTeam',
      messageThread : 'thread'
    },
    /**
     * Initialize the router for the given component
     *
     * @param {Component} appComponent - the app component that the router will be attached too
     */
    init : function(appComponent){
      var Router = require('director').Router;

      var router = new Router({
        '/': appComponent.setState.bind(appComponent, {routeName: this.routes.login}),
        '/allTeams': appComponent.setState.bind(appComponent, {routeName: this.routes.messagesForAllTeams}),
        '/usersTeam': appComponent.setState.bind(appComponent, {routeName: this.routes.messagesForSelectedTeam}),
        '/thread': appComponent.setState.bind(appComponent, {routeName: this.routes.messageThread})
      });

      router.init();
    }
  };
};