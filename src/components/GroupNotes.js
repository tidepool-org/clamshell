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

require('./GroupNotes.css');

var Note = require('./Note');

var GroupNotes = React.createClass({

  niceTime: function(time){
    return time;
  },

  notesForGroup:function(group){

    var notes = _.filter(group.messages, function(note){
      return note.rootmessageid === ''; 
    });

    var items =  _.map(notes, function(note){ 
        return (
          /* jshint ignore:start */
          <Note
              ref='groupNote'
              onClick={this.props.onThreadSelected.bind(null, note)}
              key={note.id}
              name={group.name}
              note={note.messagetext}
              when={this.niceTime(note.timestamp)}/>
          /* jshint ignore:end */
        );
      }.bind(this));

    return items;
  },

  render: function() {

    var items = this.props.groups.map(function(group,i){
      return this.notesForGroup(group);
    }.bind(this));

    return (
        /* jshint ignore:start */
        <div className="groupnotes list-group">
            {items}
        </div>
        /* jshint ignore:end */
    );
  }
});

module.exports = GroupNotes;

