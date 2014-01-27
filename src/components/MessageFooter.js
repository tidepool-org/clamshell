/** @jsx React.DOM */

var React = require('react');

//Form for adding Comments
var MessageFooter = React.createClass({

    handleSubmit: function() {
        var messageText = this.refs.messageText.getDOMNode().value.trim();
        this.props.onFooterAction({text: messageText});
        this.refs.messageText.getDOMNode().value = '';
        return false;
    },

    render: function() {

        return this.transferPropsTo(
            /* jshint ignore:start */
            <nav className="navbar navbar-default navbar-fixed-bottom">
                <form className="navbar-form">
                    <div className="form-group col-xs-10">
                        <input type="text" className="form-control " ref='messageText' placeholder={this.props.messagePrompt} />
                    </div>
            
                    <button type="submit" ref='sendBtn' className="btn btn-default col-xs-2" onClick={this.handleSubmit}>{this.props.btnMessage}</button>
                </form>
            </nav>
            /* jshint ignore:end */ 
        );
    }
});

module.exports = MessageFooter;