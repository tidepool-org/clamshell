/**
 * @jsx React.DOM
 */

/**
 * Copyright (c) 2014, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

'use strict';
/* jshint unused: false */

var React = require('react');

require('./Header.less');

var Header = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    leftIcon: React.PropTypes.string,
    rightIcon: React.PropTypes.string,
    onLeftAction: React.PropTypes.func,
    onRightAction: React.PropTypes.func
  },

  render: function() {
    var left = this.renderAction({
      side: 'left',
      icon: this.props.leftIcon,
      action: this.props.onLeftAction
    });

    var right = this.renderAction({
      side: 'right',
      icon: this.props.rightIcon,
      action: this.props.onRightAction
    });

    return (
      /* jshint ignore:start */
      <div className='header'>
        {left}
        <div className='header-item header-center header-overflow-ellipsis' ref='title'>
          {this.props.title}
        </div>
        {right}
      </div>
      /* jshint ignore:end */
    );
  },

  renderAction: function(options) {
    var side = options.side;
    var icon = options.icon;
    var action = options.action;
    var content = null;

    if (icon) {
      /* jshint ignore:start */
      content = (
        <span
          className={'header-icon header-icon-' + icon}
          ref={side + 'Icon'}></span>
      );
      /* jshint ignore:end */
    }

    if (action) {
      var handleClick = function(e) {
        if (e) {
          e.preventDefault();
        }
        action();
      };

      /* jshint ignore:start */
      content = (
        <a
          href=''
          className='header-icon-link'
          onClick={handleClick}
          ref={side + 'Link'}>
          {content}
        </a>
      );
      /* jshint ignore:end */
    }

    /* jshint ignore:start */
    return (
      <div className={'header-item header-item-with-icon header-' + side}>
        {content}
      </div>
    );
    /* jshint ignore:end */
  }
});

module.exports = Header;
