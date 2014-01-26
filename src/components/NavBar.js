/** @jsx React.DOM */

var React = require('react');

var NavBar = React.createClass({

    handleLogout:function(){
        var self = this;
        
        this.props.logout(function(){
            self.props.onLogoutSuccess();
        });
    },
  
    getStandardNav : function(){
        return (
            /* jshint ignore:start */
            <nav className="navbar navbar-default navbar-fixed-top" role="navigation">
                <ul className="nav navbar-nav">
                    <li><a href="#/group">Groups</a></li>
                    <li><a href="#/thread">Notes</a></li>
                </ul>
                <button type="button" ref='signOutBtn' className="btn btn-default navbar-btn" onClick={this.handleLogout}>Sign out</button>
            </nav>
            /* jshint ignore:end */
        );
    },

    render: function() {
        return this.getStandardNav();
    }
});

module.exports = NavBar;