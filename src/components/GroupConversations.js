/** @jsx React.DOM */
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
                    latestNoteSummary={this.summaryForMessage(message.messagetext)}
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

