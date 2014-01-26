/** @jsx React.DOM */
var React = require('react');

var ConversationOverview = React.createClass({
    render: function() {
        return this.transferPropsTo(
            <a href="#" className="list-group-item">
            	<div className='row'>	
            		<span ref='noteWhen' className="col-xs-4 col-xs-offset-8 small pull-right">{this.props.when}</span>
            	</div>
            	<div className='row'>
                	<h4 ref='groupName' className="col-xs-8 list-group-item-heading">{this.props.name}</h4>
                	<p ref='noteSummary' className="col-xs-8 list-group-item-text">{this.props.latestNoteSummary}</p>
                </div>
            </a>
        );
    }
});

module.exports = ConversationOverview;

