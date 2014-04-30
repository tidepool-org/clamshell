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

  renderHeading : function(){
    /* jshint ignore:start */
    var noteTeam;

    if(this.props.team){
      noteTeam = (
        <span className='note-for-team'>
          <span> > {this.props.team}</span>
        </span>
      );
    }
    return (
      <div>
        <strong ref='messageAuthorAndGroup' className='note-header media-heading'> {this.props.author}</strong>
        {noteTeam}
      </div>
    );
    /* jshint ignore:end */
  },

  renderCommentLink : function(){
    if(this.props.showCommentLink){
      return (
        /* jshint ignore:start */
        <div>
          <span ref='showMessageThread' className='small pull-right note-comment'>Comment</span>
        </div>
        /* jshint ignore:end */
      );
    }
  },

  render: function() {

    var commentLink = this.renderCommentLink();
    var noteHeading = this.renderHeading();
    var className = 'note media';
    if (this.props.onNoteSelected) {
      className = className + ' note-clickable';
    }

    return this.transferPropsTo(
      /* jshint ignore:start */
      <div className={className} onClick={this.props.onNoteSelected}>
        <div ref='imgColumn' className='media-object pull-left'>
          <div ref='authorImage' className={this.props.image}/>
        </div>
        <div ref='detailColumn' className='media-body'>
          {noteHeading}
          <span ref='messageWhen' className='small note-when'>{this.props.when}</span>
          <p ref='messageText' className='note-message'>{this.props.note}</p>
          {commentLink}
        </div>
      </div>
      /* jshint ignore:end */
    );
  }
});

module.exports = Note;
