/** @jsx React.DOM */

var React = require('react');

//Form for adding Comments
var MessageFooter = React.createClass({

    handleSubmit: function() {
        var messageText = this.refs.messageText.getDOMNode().value.trim();
        this.props.onAddMessageToThread({text: messageText});
        this.refs.messageText.getDOMNode().value = '';
    },

    render: function() {

        return this.transferPropsTo(
            /* jshint ignore:start */
            <nav className="navbar navbar-default navbar-fixed-bottom">
                <form className="navbar-form navbar-left">
                    <div className="form-group">
                        <input type="text" className="form-control" ref='messageText' placeholder={this.props.messagePrompt} />
                    </div>
            
                    <button type="submit" ref='sendBtn' className="btn btn-default" onClick={this.handleSubmit}>{this.props.btnMessage}</button>
                </form>
            </nav>
            /* jshint ignore:end */ 
        );
    }
});

module.exports = MessageFooter;