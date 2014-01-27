/** @jsx React.DOM */

var React = require('react');

//Groups chooser
var GroupsPicker = React.createClass({

    handleSelection: function(e) {
        console.log('selected group is: ',e);
        this.props.onGroupPicked({groupId:1});
    },

    render: function() {

        var groups = this.props.groups.map(function(group,i) {    
            return (
                /* jshint ignore:start */
                <li key={i}>
                    <a className='row' href='#' onClick={this.handleSelection.bind(null, group.id)}>
                        <div className='row'>
                            <p ref='groupName'>{group.name}</p>
                            <p ref='lastGroupActivity'>Last note Dec 25th</p>
                        </div>
                    </a>
                </li>
                /* jshint ignore:end */    
            );
        }.bind(this));

        return this.transferPropsTo(
            /* jshint ignore:start */
            <div className='btn-group' ref='groupsDropDown'>
                <button type='button' className='btn navbar-btn pull-left dropdown-toggle' data-toggle='dropdown'>
                    <span className='caret'></span>
                </button>
                <ul className='dropdown-menu' ref='groupsList' role='menu'>
                    {groups}
                </ul>
            </div>
            /* jshint ignore:end */ 
        );
    }
});

module.exports = GroupsPicker;