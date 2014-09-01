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
    onThreadSelected : React.PropTypes.func
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
    if(this.props.onThreadSelected){
      showThread = this.props.onThreadSelected.bind(null,note);
    }
    return showThread;
  },
  showAsThread:function(){
    return this.props.onThreadSelected ? false : true;
  },
  renderThread:function(){
    if(_.isEmpty(this.props.notes) === false){

      //Note first then ordered comments
      var thread = _.sortBy(this.props.notes, function(note) {
        return _.isEmpty(note.parentmessage) || new Date(note.timestamp);
      });

      var notes = _.map(thread ,function(note) {
        if(!note.parentmessage) {
          return this.renderNote(note);
        } else if (note.parentmessage) {
          return this.renderComment(note);
        }
      }.bind(this));

      return notes;
    }
  },
  renderParents:function(){
    if(_.isEmpty(this.props.notes) === false){

      //Newest note first, or if there is a new
      //comment on an existing note bubble it up
      var parents = dataHelper.sortNotesDescending(this.props.notes);

      var notes = _.map(parents, function(note){
        if(!note.parentmessage) {
          return this.renderNote(note);
        }
        return;
      }.bind(this));

      return notes;

    }
  },
  render: function() {

    var listClasses = 'notelist';
    var notes;

    if (this.showAsThread()) {
      notes = this.renderThread();
      listClasses = listClasses +' notelist-thread';
    } else {
      notes = this.renderParents();
      listClasses = listClasses +' notelist-parents';
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
