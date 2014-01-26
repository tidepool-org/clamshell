/** @jsx React.DOM */
var React = require('react');

var MessageItem = require('./MessageItem');

var MessageItemList = React.createClass({

    render: function() {
        var items = this.props.messages.map(function(message, i) {

            return (
                /* jshint ignore:start */
                <MessageItem
                    key={message.id} 
                    who={message.name}
                    messageText={message.messagetext}
                    when={message.timestamp}/>
                /* jshint ignore:end */    
            );
        });

        return (
        	/* jshint ignore:start */
            <div className="list-group">
                {items}
            </div>
            /* jshint ignore:end */
        );
    }
});

module.exports = MessageItemList;

