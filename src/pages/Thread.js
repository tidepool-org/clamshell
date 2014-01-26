/** @jsx React.DOM */

var React = require('react');

var MessageItemList = require('../components/MessageItemList');

var Thread = React.createClass({
    render: function() {
    	return <MessageItemList messages={this.props.messages} />;
    }
});

module.exports = Thread;