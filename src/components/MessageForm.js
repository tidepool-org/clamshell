/** @jsx React.DOM */

var React = require('react');

//Form for adding Comments
var MessageForm = React.createClass({

    handleSubmit: function() {
        var messageText = this.refs.messageText.getDOMNode().value.trim();
        var selectedGroup = false;

        //find the selected group if we are usng them
        if(this.props.groups){
            selectedGroup = this.refs.groupsDropDown.getDOMNode().value.trim();
        }

        this.props.onMessageSend({text: messageText, group:selectedGroup});
        this.refs.messageText.getDOMNode().value = '';
    },

    renderGroups : function(){

        var groups = this.props.groups.map(function(group) {    
            return (
                /* jshint ignore:start */
                <option value={group.id}>{group.name}</option>
                /* jshint ignore:end */    
            );
        });
    
        return (
            /* jshint ignore:start */
            <div className="form-group">
                <select className='form-control' ref='groupsDropDown'>
                    {groups}
                </select>
            </div>
            /* jshint ignore:end */
        );
    },

    render: function() {

        var groupsDropDown = null;

        if(this.props.groups){
           groupsDropDown = this.renderGroups();
        }

        return this.transferPropsTo(
            /* jshint ignore:start */
            <div>
                <form>
                    {groupsDropDown}
                    <div className="form-group">
                        <textarea type='textarea' className="form-control" rows="3" placeholder='Say something...' ref='messageText' />
                    </div>
                </form>
                <nav className="navbar navbar-default navbar-fixed-bottom">
                    <button type="button" ref='sendBtn' className="btn footer-btn" onClick={this.handleSubmit}>Send</button>
                </nav>
            </div>
            /* jshint ignore:end */ 
        );
    }
});

module.exports = MessageForm;
