/** @jsx React.DOM */
var React = require('react');

var MessageItem = React.createClass({
    render: function() {
        return this.transferPropsTo(
            <a href="#" className="list-group-item">
            	<div className='row'>
            	<span ref='messageWho' className="pull-left small">{this.props.who}</span>
                <p ref='messageText' className="col-xs-10 list-group-item-text">{this.props.messageText}</p>
                <p ref='messageWhen' className="col-xs-10 text-center small">{this.props.when}</p>
                </div>
            </a>
        );
    }
});

module.exports = MessageItem;

