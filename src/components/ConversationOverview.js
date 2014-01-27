/** @jsx React.DOM */
var React = require('react');

var ConversationOverview = React.createClass({
    render: function() {
        return this.transferPropsTo(
            <a href="#" className="list-group-item row">
                <div className='col-xs-3'>  
                    image here
                </div>
            	<div className='row col-xs-offset-3 col-xs-9'>
                    <h4 ref='groupName' className="list-group-item-heading"> User Name > {this.props.name}</h4>
            	</div>
                <div className='row col-xs-offset-3 col-xs-9'> 
                    <span ref='noteWhen' >{this.props.when}</span>
                </div>
            	<div className='row col-xs-offset-3 col-xs-9'>
                	<p ref='noteSummary' className="list-group-item-text">{this.props.latestNoteSummary}</p>
                </div>
                <div className='row col-xs-offset-3 col-xs-9'>
                    <p ref='noteSummary' className="list-group-item-text">Comment stuff</p>
                </div>
            </a>
        );
    }
});

module.exports = ConversationOverview;

