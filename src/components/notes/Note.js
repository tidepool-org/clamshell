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

require('./Note.css');

var Note = React.createClass({

  niceTime: function(time){
    return sundial(time).calendar();
  },

  render: function() {

    /* jshint ignore:start */
    var commentLink;

    if(this.props.showCommentLink){
      commentLink = (<div><a ref='showMessageThread' className='pull-left note-link'>x Comments</a><a ref='showMessageThread' className='pull-right note-link'>Comment</a></div>);
    }

    return this.transferPropsTo(
      <div className="note list-group-item row">
      <div ref='imgColumn' className={this.props.imgColumns}>
        <div ref='authorImage' className="note-image"/>
      </div>
      <div ref='detailColumn' className={this.props.detailColumns}>
      <h4 ref='messageAuthorAndGroup' className="note-header list-group-item-heading">{this.props.author}<a onClick={this.props.onGroupSelected} ref='careTeam'>{this.props.name}</a></h4>
      <span ref='messageWhen' className='note-when'>{this.niceTime(this.props.when)}</span>
      <p ref='messageText' className="note-message list-group-item-text">{this.props.note}</p>
      {commentLink}
      </div>
      </div>
      );
    /* jshint ignore:end */
  }
});

module.exports = Note;

