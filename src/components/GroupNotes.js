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
var _ = require('underscore');

var Note = require('./Note');

var GroupNotes = React.createClass({

  niceTime: function(time){
    return time;
  },

  conversationsForGroup:function(group){

    var convsersations = _.filter(group.messages, function(message){
      return message.rootmessageid === ''; 
    });

    var items =  _.map(convsersations, function(message){ 
        return (
          /* jshint ignore:start */
          <Note
              ref='groupNote'
              onClick={this.props.onThreadSelected.bind(null, message)}
              key={message.id}
              name={group.name}
              note={message.messagetext}
              when={this.niceTime(message.timestamp)}/>
          /* jshint ignore:end */
        );
      }.bind(this));

    return items;
  },

  render: function() {

    var items = this.props.groups.map(function(group,i){
      return this.conversationsForGroup(group);
    }.bind(this));

    return (
        /* jshint ignore:start */
        <div className="list-group">
            {items}
        </div>
        /* jshint ignore:end */
    );
  }
});

module.exports = GroupNotes;

