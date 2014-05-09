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

require('./Note.less');

var Note = React.createClass({

  propTypes: {
    when : React.PropTypes.string,
    image : React.PropTypes.string,
    author : React.PropTypes.string,
    note : React.PropTypes.string,
    team : React.PropTypes.string,
    showCommentLink : React.PropTypes.bool,
    onGroupSelected : React.PropTypes.func,
    onNoteSelected : React.PropTypes.func
  },

  renderTitle : function(){
    var noteTeam;
    //show if they differ - there is no point in showing My Group > MyGroup
    if(this.props.team && this.props.team !== this.props.author){
      /* jshint ignore:start */
      noteTeam = (
        <span className='note-title-team'>
          <span>{' to ' + this.props.team}</span>
        </span>
      );
      /* jshint ignore:end */
    }
    /* jshint ignore:start */
    return (
      <div ref='messageAuthorAndGroup' className='note-title'>
        <span className='note-title-author'>{this.props.author}</span>
        {noteTeam}
      </div>
    );
    /* jshint ignore:end */
  },

  renderCommentLink : function(){
    if(this.props.showCommentLink){
      return (
        /* jshint ignore:start */
        <div ref='showMessageThread' className='note-comments'>
          <div className='note-comments-text'>Comment</div>
        </div>
        /* jshint ignore:end */
      );
    }
  },

  renderNoteContent: function() {
    var noteTitle = this.renderTitle();
    var commentLink = this.renderCommentLink();

    return this.transferPropsTo(
      /* jshint ignore:start */
      <div className='note-content'>
        <div ref='imgColumn' className={'note-picture note-picture-' + this.props.image}></div>
        <div ref='detailColumn' className='note-details'>
          <div className='note-header'>
            {noteTitle}
            <div ref='messageWhen' className='note-timestamp'>{this.props.when}</div>
          </div>
          <div ref='messageText' className='note-text'>{this.props.note}</div>
          {commentLink}
        </div>
      </div>
      /* jshint ignore:end */
    );
  },

  render: function() {
    var className = 'note';

    var note = this.renderNoteContent();

    var onNoteSelected = this.props.onNoteSelected;
    if (onNoteSelected) {
      var handleClick = function(e) {
        if (e) {
          e.preventDefault();
        }
        onNoteSelected();
      };

      className = className + ' note-link';

      /* jshint ignore:start */
      note = (
        <a href='' className={className} onClick={handleClick}>
          {note}
        </a>
      );
      /* jshint ignore:end */
    }
    else {
      /* jshint ignore:start */
      note = (
        <div className={className}>
          {note}
        </div>
      );
      /* jshint ignore:end */
    }

    return note;
  }
});

module.exports = Note;
