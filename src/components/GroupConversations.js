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

var React = require('react');
var _ = require('underscore');

var ConversationOverview = require('./ConversationOverview');

var GroupConversations = React.createClass({

    summaryForMessage: function(messageText){
        //return the first 10 words or less
        var summary = messageText;

        if(messageText && messageText.split(' ').length > 10){
            //do we have more than ten words?
            summary = messageText.split(' ').slice(0,10).join(' ');
            summary += ' ...';
        }
        return summary;
    },

    niceTime: function(time){
        return time;
    },

    conversationsForGroup:function(group){

        var mostRecentForConversation = [];

        var convsersations = _.groupBy(group.messages, 'rootmessageid');

        _.each(convsersations, function(conversationMessages){

            var latest =  _.sortBy(conversationMessages, function (message) {
                return message.timestamp;
            });

            mostRecentForConversation.push(latest[0]); 
            
        });

        var items = mostRecentForConversation.map(function(message, i) {

            return (
                /* jshint ignore:start */
                <ConversationOverview
                    onClick={this.props.onThreadSelected.bind(null, message)}
                    key={message.rootmessageid} 
                    name={group.name}
                    latestNoteSummary={message.messagetext}
                    when={this.niceTime(message.timestamp)}/>
                /* jshint ignore:end */    
            );
        }.bind(this));

        return items;
    },

    render: function() {

        var items = this.conversationsForGroup(this.props.groups[0]); 

        return (
            /* jshint ignore:start */
            <div className="list-group">
                {items}
            </div>
            /* jshint ignore:end */
        );
    }
});

module.exports = GroupConversations;

