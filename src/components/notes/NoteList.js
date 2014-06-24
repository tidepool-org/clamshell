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
  renderThreadNote: function(note){
    return (
      /* jshint ignore:start */
      <Note
        ref='rootNote'
        image='large'
        key={note.id}
        theNote={note}
        onSaveEdit={this.getSaveEdit(note)}/>
      /* jshint ignore:end */
    );
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
        onShowThread={this.props.onShowThread.bind(null, note)}/>
      /* jshint ignore:end */
    );
  },
  renderThreadComment:function(note){
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
  showAsThread:function(){
    return this.props.onShowThread ? false : true;
  },
  renderThread:function(){
    if(_.isEmpty(this.props.notes) === false){

      //Oldest comment first
      var thread = dataHelper.sortNotesAscending(this.props.notes);

      var notes = _.map(thread ,function(note) {
        if(!note.parentmessage) {
          return this.renderThreadNote(note);
        } else if (note.parentmessage) {
          return this.renderThreadComment(note);
        }
      }.bind(this));

      return notes;
    }
  },
  renderParents:function(){
    if(_.isEmpty(this.props.notes) === false){

      //Newest note first
      var parents = dataHelper.sortNotesDescending(this.props.notes);

      var notes = _.map(parents, function(note){
        if(!note.parentmessage) {
          return this.renderNote(note);
        }
      }.bind(this));

      return notes;

    }
  },
  render: function() {

    var listClasses = 'notelist';
    var notes;

    if (this.state.parentView) {
      notes = this.renderParents();
      listClasses = listClasses +' parents';
    } else if (this.state.threadView) {
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
