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
var sundial = require('moment');

var Note = React.createClass({

  niceTime: function(time){
    return sundial(time).calendar();
  },

  renderHeading : function(){
    /* jshint ignore:start */
    var noteTeam;

    if(this.props.team){
      noteTeam = (
        <span className='pull-right'>
          <span className='note-for-team'> > </span>
          <a onClick={this.props.onGroupSelected} className='note-link' ref='careTeam'>{this.props.team}</a>
        </span>
      );
    }
    return (
      <div>
        <span ref='messageAuthorAndGroup' className='note-header media-heading'> {this.props.author}</span>
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
          <a ref='showMessageThread' className='pull-left note-number-comments'>{this.props.numberOfComments} Comments</a>
          <a ref='showMessageThread' className='pull-right note-comment'>Comment</a>
        </div>
        /* jshint ignore:end */
      );
    }
  },

  render: function() {

    var commentLink = this.renderCommentLink();
    var noteHeading = this.renderHeading();

    return this.transferPropsTo(
      /* jshint ignore:start */
      <div className='note media'>
        <div ref='imgColumn' className='media-object pull-left'>
          <div ref='authorImage' className={this.props.image}/>
        </div>
        <div ref='detailColumn' className='media-body'>
          {noteHeading}
          <span ref='messageWhen' className='note-when'>{this.niceTime(this.props.when)}</span>
          <p ref='messageText' className='note-message'>{this.props.note}</p>
          {commentLink}
        </div>
      </div>
      /* jshint ignore:end */
    );
  }
});

module.exports = Note;

