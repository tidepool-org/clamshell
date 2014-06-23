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

var MessageForm = require('../form/MessageForm');
var dataHelper = require('../../core/userDataHelper');

require('./Note.less');

var Note = React.createClass({

  propTypes: {
    theNote : React.PropTypes.object,
    image : React.PropTypes.string,
    onShowThread : React.PropTypes.func,
    onSaveEdit : React.PropTypes.func
  },

  getInitialState: function() {
    return {
      editing : false
    };
  },

  componentDidMount: function () {
    this.setState({
      author :  dataHelper.formatFullName(this.props.theNote.user),
      team : dataHelper.formatFullName(this.props.theNote.team),
      numberOfComments : dataHelper.getComments(this.props.theNote.id),
      note : this.props.theNote.messagetext,
      when : dataHelper.formatDisplayDate(this.props.theNote.timestamp)
    });
  },

  getNote : function(){
    return this.props.theNote;
  },

  handleShowThread : function(e){
    if (e) {
      e.preventDefault();
    }
    var showThread = this.props.onShowThread;

    if (showThread) {
      showThread();
    }
  },

  handleEditSave:function(edits){

    var saveEdit = this.props.onSaveEdit;

    if(saveEdit){
      var noteUpdates = this.props.theNote;
      noteUpdates.messagetext = edits.text;
      noteUpdates.timestamp = edits.timestamp;
      saveEdit(noteUpdates);
      this.setState({
        note : edits.text,
        when : dataHelper.formatDisplayDate(edits.timestamp),
        editing : false
      });
    }

  },

  handleAllowEdit : function(e){
    if (e) {
      e.preventDefault();
    }
    this.setState({editing:true});
  },

  handleCancelEdit : function(e){
    if (e) {
      e.preventDefault();
    }
    this.setState({editing:false});
  },

  renderTitle : function(){
    var noteTeam;
    //show if they differ - there is no point in showing My Group > MyGroup
    if(this.state.team && this.state.team !== this.state.author){
      /* jshint ignore:start */
      noteTeam = (
        <span className='note-title-team'>
          <span>{' to ' + this.state.team}</span>
        </span>
      );
      /* jshint ignore:end */
    }
    /* jshint ignore:start */
    return (
      <div ref='messageAuthorAndGroup' className='note-title'>
        <span className='note-title-author'>{this.state.author}</span>
        {noteTeam}
      </div>
    );
    /* jshint ignore:end */
  },

  renderShowThreadLink : function(){
    if(this.props.onShowThread){
      return (
        /* jshint ignore:start */
        <a
          className='note-comments note-comments-text'
          href=''
          onClick={this.handleShowThread}
          ref='showMessageThread'>Comments</a>
        /* jshint ignore:end */
      );
    }
  },

  renderEditLink : function(){

    if(this.props.onSaveEdit){
      return (
        /* jshint ignore:start */
        <a
          className='note-edit'
          href=''
          onClick={this.handleAllowEdit}
          ref='editNote'>Edit</a>
        /* jshint ignore:end */
      );
    }
  },

  renderAsEdit:function(){
    return(
      /* jshint ignore:start */
      <MessageForm
        editNote={this.props.theNote}
        onSubmit={this.handleEditSave}
        onCancel={this.handleCancelEdit}
        saveBtnText='Save' />
      /* jshint ignore:end */
    );
  },

  renderAsDetail:function(){
    return(
      /* jshint ignore:start */
      <div>
      <div className='note-header'>
        <div ref='messageWhen' className='note-timestamp'>{this.state.when}</div>
      </div>
      <div ref='messageText' className='note-text'>{this.state.note}</div>
      </div>
      /* jshint ignore:end */
    );
  },

  renderNoteContent: function() {
    var title = this.renderTitle();
    var editLink;
    var form;
    var details;

    if( this.state.editing ){
      form = this.renderAsEdit();
    } else {
      details = this.renderAsDetail();
      editLink = this.renderEditLink();
    }
    var threadLink = this.renderShowThreadLink();

    return this.transferPropsTo(
      /* jshint ignore:start */
      <div className='note-content'>
        <div ref='imgColumn' className={'note-picture note-picture-' + this.props.image}></div>
        <div ref='detailColumn' className='note-details'>
          {editLink}
          {title}
          {details}
          {form}
          {threadLink}
        </div>
      </div>
      /* jshint ignore:end */
    );
  },

  render: function() {

    var noteClasses = 'note';
    var note = this.renderNoteContent();
    if( this.state.editing ){
      noteClasses = noteClasses + ' note-editing';
    }

    return (
      /* jshint ignore:start */
      <div className={noteClasses}>
        {note}
      </div>
      /* jshint ignore:end */
    );
  }
});

module.exports = Note;
