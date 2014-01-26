/** @jsx React.DOM */

var React = require('react');

var FooterBar = React.createClass({

    handleAction:function(){

        this.props.onActionHandled();
    },

    render: function() {
        return (
            /* jshint ignore:start */
            <nav className="navbar navbar-default navbar-fixed-bottom">
                <button type="button" ref='actionBtn' className="btn footer-btn" onClick={this.handleAction}>{this.props.actionName}</button>
            </nav>
            /* jshint ignore:end */
        );
    }
});

module.exports = FooterBar;