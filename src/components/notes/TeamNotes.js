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
var _ = require('lodash');
var sundial = require('moment');

var Note = require('./Note');

var TeamNotes = React.createClass({

  notesForGroup:function(group){

    var notes = _.filter(group.notes, function(note){
      return (!note.parentmessage);
    });

    var items =  _.map(notes, function(note){
        return (
          /* jshint ignore:start */
          <Note
              ref='teamNote'
              imgColumns='col-xs-3 col-sm-1'
              detailColumns='col-xs-9 col-sm-11'
              onClick={this.props.onThreadSelected.bind(null, note)}
              key={note.id}
              author='Author'
              team='Team'
              numberOfComments='??'
              note={note.messagetext}
              when={note.timestamp}
              showCommentLink={true}/>
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
        <div className='teamnotes list-group'>
            {items}
        </div>
        /* jshint ignore:end */
    );
  }
});

module.exports = TeamNotes;

