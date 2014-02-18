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

var Note = require('./Note');

var NoteThread = React.createClass({

    renderNote: function(message){
      return (
        /* jshint ignore:start */
        <Note
            ref='rootNote'
            imgColumns='col-xs-2'
            detailColumns='col-xs-10'
            key={message.id}
            author={message.userid}
            note={message.messagetext}
            when={message.timestamp}
            showCommentLink={false}/>
        /* jshint ignore:end */
      );
    },
    renderCommentOnNote:function(message){
      return (
        /* jshint ignore:start */
        <Note
            ref='commentNote'
            imgColumns='col-xs-2 col-xs-offset-2'
            detailColumns='col-xs-8'
            key={message.id}
            author={message.userid}
            note={message.messagetext}
            when={message.timestamp}
            showCommentLink={false}/>
        /* jshint ignore:end */
      );
    },
    render: function() {
        var items = this.props.messages.map(function(message, i) {

            if(i==0) {
                //this is the parent note
                return this.renderNote(message);
            } else {
                //here are the comments if any
                return this.renderCommentOnNote(message);
            }
        }.bind(this));

        return (
        	/* jshint ignore:start */
            <div ref='messageThread' className="messageitemlist-thread list-group">
                {items}
            </div>
            /* jshint ignore:end */
        );
    }
});

module.exports = NoteThread;

