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
var sundial = require('sundial');

var MessageForm = require('../form/MessageForm');
var dataHelper = require('../../core/userDataHelper');

require('./Note.less');

var Note = React.createClass({

  propTypes: {
    theNote : React.PropTypes.object,
    image : React.PropTypes.string,
    onShowThread : React.PropTypes.func,
    commentCount : React.PropTypes.number,
    onSaveEdit : React.PropTypes.func
  },

  getInitialState: function() {
    return {
      editing : false
    };
  },

  componentDidMount: function () {

    var offset = sundial.getOffsetFromTime(this.props.theNote.timestamp) || sundial.getOffset();

    this.setState({
      author :  dataHelper.formatFullName(this.props.theNote.user),
      team : dataHelper.formatTeamFullName(this.props.theNote.team),
      numberOfComments : this.props.commentCount,
      note : this.props.theNote.messagetext,
      when : sundial.formatFromOffset(this.props.theNote.timestamp,offset)
    });
  },

  isComment : function(){
    return _.isEmpty(this.props.theNote.parentmessage) === false;
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
      var offset = sundial.getOffsetFromTime(this.props.theNote.timestamp) || sundial.getOffset();

      this.props.theNote.messagetext = edits.text;
      if (edits.timestamp) {
        this.props.theNote.timestamp = edits.timestamp;
      }
      saveEdit(this.props.theNote);

      this.setState({
        editing : false,
        note : this.props.theNote.messagetext,
        when : sundial.formatFromOffset(this.props.theNote.timestamp,offset)
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
    var edit = this.renderEditLink();
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
        {edit}
        <span className='note-title-author'>{this.state.author}</span>
        {noteTeam}
      </div>
    );
    /* jshint ignore:end */
  },

  renderComments : function(){

    var commentString = 'Comments';

    if(this.state.numberOfComments === 1){
      commentString = 'Comment';
    }

    if(this.props.onShowThread){
      return (
        /* jshint ignore:start */
        <span
          className='note-comments note-comments-text'
          ref='showMessageThread'>{this.state.numberOfComments} {commentString}</span>
        /* jshint ignore:end */
      );
    }
  },

  renderEditLink : function(){
    if(this.props.onSaveEdit && this.state.editing === false ){
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
    if(this.state.editing){
      if ( this.isComment() ){
        //we only allow the editing of the text on a comment
        return(
          /* jshint ignore:start */
          <MessageForm
            existingNoteFields={{editableText: this.props.theNote.messagetext, displayOnlyTimestamp : this.props.theNote.timestamp }}
            onSubmit={this.handleEditSave}
            onCancel={this.handleCancelEdit}
            saveBtnText='Save' />
          /* jshint ignore:end */
        );
      } else {
        return(
          /* jshint ignore:start */
          <MessageForm
            existingNoteFields={{editableText: this.props.theNote.messagetext, editableTimestamp: this.props.theNote.timestamp}}
            onSubmit={this.handleEditSave}
            onCancel={this.handleCancelEdit}
            saveBtnText='Save' />
          /* jshint ignore:end */
        );
      }
    }
  },

  renderAsDetail:function(){
    if(this.state.editing === false){
      return(
        /* jshint ignore:start */
        <a href='' className='note-clickable' ref='noteDetails' onClick={this.handleShowThread}>
          <div className='note-header'>
            <div ref='messageWhen' className='note-timestamp'>{this.state.when}</div>
          </div>
          <div ref='messageText' className='note-text'>{this.state.note}</div>
            {this.renderComments()}
        </a>
        /* jshint ignore:end */
      );
    }
  },

  renderNoteContent: function() {

    var details = this.renderAsDetail() ? this.renderAsDetail() : this.renderAsEdit();

    return this.transferPropsTo(
      /* jshint ignore:start */
      <div className='note-content'>
        <div ref='imgColumn' className={'note-picture note-picture-' + this.props.image}></div>
        <div ref='detailColumn' className='note-details'>
          {this.renderTitle()}
          {details}
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
      <div className={noteClasses} >
        {note}
      </div>
      /* jshint ignore:end */
    );
  }
});

module.exports = Note;
