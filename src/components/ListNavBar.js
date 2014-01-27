/** @jsx React.DOM */

var React = require('react');

var ListNavBar = React.createClass({

    handleAction:function(){
        this.props.onNavBarAction();
    },

    render: function() {
        return (
            /* jshint ignore:start */
            <nav className='navbar navbar-default navbar-fixed-top' role='navigation'>
                <button type='button' ref='actionBtn' className='btn btn-default navbar-btn col-xs-1' onClick={this.handleAction}><span className={this.props.actionIcon}></span></button>
                <p className='navbar-text text-center col-xs-8'>{this.props.title}</p>
                <div className='col-xs-2 pull-right'>
                    {this.props.children}
                </div>
            </nav>
            /* jshint ignore:end */
        );
    }
});

module.exports = ListNavBar;