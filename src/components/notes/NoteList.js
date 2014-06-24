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
var _ = require('lodash');

require('./NoteList.less');

var Note = require('./Note');

var dataHelper = require('../../core/userDataHelper');

var NoteList = React.createClass({

  propTypes: {
    notes: React.PropTypes.array,
    loggedInId: React.PropTypes.string,
    onSaveEdited : React.PropTypes.func,
    onShowThread : React.PropTypes.func
  },
  getInitialState: function() {
    return {
      threadView : false,
      parentView : false
    };
  },
  componentDidMount: function () {
    this.setState({
      threadView :  this.showAsThread(),
      parentView : this.showAsThread() === false
    });
  },
  renderNote: function(note){
    return (
      /* jshint ignore:start */
      <Note
        ref='rootNote'
        image='large'
        key={note.id}
        theNote={note}
        onSaveEdit={this.getSaveEdit(note)}
        onShowThread={this.getShowThread(note)}/>
      /* jshint ignore:end */
    );
  },
  renderComment:function(note){
    return (
      /* jshint ignore:start */
      <Note
        ref='commentNote'
        image='small'
        key={note.id}
        theNote={note}
        onSaveEdit={this.getSaveEdit(note)}/>
      /* jshint ignore:end */
    );
  },
  getSaveEdit:function(note){
    var saveEdit;
    if(note.userid === this.props.loggedInId){
      saveEdit = this.props.onSaveEdited;
    }
    return saveEdit;
  },
  getShowThread:function(note){
    var showThread;
    if(this.showAsThread()){
      showThread = this.props.onShowThread.bind(null, note);
    }
    return showThread;
  },
  showAsThread:function(){
    return this.props.onShowThread ? true : false;
  },
  renderThread:function(){
    if(_.isEmpty(this.props.notes) === false){

      //Oldest comment first
      var sorted = dataHelper.sortNotesAscending(this.props.notes);

      var thread = _.map(sorted ,function(note) {
        if(!note.parentmessage) {
          return this.renderNote(note);
        } else if (note.parentmessage) {
          return this.renderComment(note);
        }
      }.bind(this));

      return thread;
    }
  },
  renderParentNotes:function(){
    if(_.isEmpty(this.props.notes) === false){

      //Newest note first
      var parentNotes = dataHelper.filterNotes(this.props.notes);
      parentNotes = dataHelper.sortNotesDescending(parentNotes);

      var notes = _.map(parentNotes, function(note){
        return this.renderNote(note);
      }.bind(this));

      return notes;

    }
  },
  render: function() {

    var listClasses = 'notelist';
    var notes;

    if (this.state.threadView) {
      notes = this.renderParentNotes();
      listClasses = listClasses +' parents';
    } else if (this.state.parentView) {
      notes = this.renderThread();
      listClasses = listClasses +' thread';
    }

    return (
     /* jshint ignore:start */
     <div ref='noteList' className={listClasses}>
      {notes}
     </div>
     /* jshint ignore:end */
     );
  }
});

module.exports = NoteList;
