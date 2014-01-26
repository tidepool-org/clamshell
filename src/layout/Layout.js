/** @jsx React.DOM */

var React = require('react');

var Layout = React.createClass({

	render: function() {

        return this.transferPropsTo(
        	/* jshint ignore:start */
            <div className='content'>
                {this.props.children}
            </div>
        	/* jshint ignore:end */
        );
    }
});

module.exports = Layout;