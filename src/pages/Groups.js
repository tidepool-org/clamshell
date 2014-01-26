/** @jsx React.DOM */

var React = require('react');

var GroupItemList = require('../components/GroupItemList');

var Groups = React.createClass({

	onShowThread : function(groupId){
        this.props.handleShowThread(groupId);
		console.log('group selected');
	},

    render: function() {

        return (
        	/* jshint ignore:start */
        	<GroupItemList groups={this.props.userGroups} onGroupSelected={this.onShowThread} />
        	/* jshint ignore:end */
        	);
    }
});

module.exports = Groups;