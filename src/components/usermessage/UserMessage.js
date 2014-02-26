/**
 * @jsx React.DOM
 */

/*
== BSD2 LICENSE ==
Copyright (c) 2014, Tidepool Project

This program is free software; you can redistribute it and/or modify it under
the terms of the associated License, which is identical to the BSD 2-Clause
License as published by the Open Source Initiative at opensource.org.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the License for more details.

You should have received a copy of the License along with this program; if
not, you can obtain one from Tidepool Project at tidepool.org.
== BSD2 LICENSE ==
*/

'use strict';

var React = require('react');

var UserMessage = React.createClass({

  renderLogos: function(){
    return (
      /* jshint ignore:start */
      <div className='logos'>
        <div className='col-xs-offset-2 col-xs-8 col-sm-offset-4 col-sm-4 row'>
          <div className='tidepool-logo' />
        </div>
        <div className='col-xs-offset-2 col-xs-8 col-sm-offset-4 col-sm-4 row'>
          <div className='blip-logo' />
        </div>
      </div>
      /* jshint ignore:end */
    );
  },

  renderMessage: function(){
    return (
      /* jshint ignore:start */
      <div className='col-xs-offset-2 col-xs-8 col-sm-offset-4 col-sm-4 row'>
        {this.props.message}
      </div>
      /* jshint ignore:end */
    );
  },

  render: function() {

    var logos = this.renderLogos();
    var message = this.renderMessage();

    return (
       /* jshint ignore:start */
      <div className='user-message'>
      {logos}
      {message}
      </div>
       /* jshint ignore:end */
    );
  }
});

module.exports = UserMessage;