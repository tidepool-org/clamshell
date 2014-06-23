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
/* jshint unused: false */

var React = require('react');

require('./NoteThread.less');

var Note = require('./Note');

var dataHelper = require('../../core/userDataHelper');

var NoteThread = React.createClass({

  propTypes: {
    messages: React.PropTypes.array,
    loggedInId: React.PropTypes.string,
    onSaveEdited : React.PropTypes.func
  },

  renderNote: function(message){
    var saveEdit;
    if(this.allowEdit(message.userid)){
      saveEdit = this.props.onSaveEdited;
    }
    return (
    /* jshint ignore:start */
    <Note
      ref='rootNote'
      image='large'
      key={message.id}
      theNote={message}
      onSaveEdit={saveEdit}/>
    /* jshint ignore:end */
    );
  },
  renderCommentOnNote:function(message){
    var saveEdit;
    if(this.allowEdit(message.userid)){
      saveEdit = this.props.onSaveEdited;
    }
    return (
      /* jshint ignore:start */
      <Note
        ref='commentNote'
        image='small'
        key={message.id}
        theNote={message}
        onSaveEdit={saveEdit}/>
      /* jshint ignore:end */
    );
  },
  allowEdit:function(noteAuthorId){
    return noteAuthorId === this.props.loggedInId;
  },
  render: function() {

    var sorted = dataHelper.sortNotesAscending(this.props.messages);

    var items = sorted.map(function(message, i) {
      if(!message.parentmessage) {
        return this.renderNote(message);
      } else if (message.parentmessage) {
        return this.renderCommentOnNote(message);
      }
    }.bind(this));

    return (
     /* jshint ignore:start */
     <div ref='messageThread' className='notethread'>
      {items}
     </div>
     /* jshint ignore:end */
     );
  }
});

module.exports = NoteThread;
