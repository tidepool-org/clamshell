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
/* jshint unused: false */

var React = require('react');

require('./Layout.less');

var Layout = React.createClass({
  propTypes: {
    notification: React.PropTypes.renderable,
    header: React.PropTypes.renderable,
    menu: React.PropTypes.renderable,
    footer: React.PropTypes.renderable
  },

  render: function() {
    var notification = this.renderNotification();
    var header = this.renderHeader();
    var menu = this.renderMenu();
    var footer = this.renderFooter();

    var contentClassName = 'layout-content layout-content-overflow-scroll';
    if (this.props.header) {
      contentClassName = contentClassName + ' layout-content-has-header';
    }
    if (this.props.footer) {
      contentClassName = contentClassName + ' layout-content-has-footer';
    }

    return (
      /* jshint ignore:start */
      <div className='layout'>
        {notification}
        {header}
        {menu}
        <div className={contentClassName} ref='content'>
          <div className='layout-content-scroll'>
            {this.props.children}
          </div>
        </div>
        {footer}
      </div>
      /* jshint ignore:end */
    );
  },

  renderNotification: function() {
    var notification = this.props.notification;

    if (!notification) {
      return null;
    }

    return (
      /* jshint ignore:start */
      <div className='layout-notification'>
        {notification}
      </div>
      /* jshint ignore:end */
    );
  },

  renderHeader: function() {
    var header = this.props.header;

    if (!header) {
      return null;
    }

    return (
      /* jshint ignore:start */
      <div className='layout-header'>
        {header}
      </div>
      /* jshint ignore:end */
    );
  },

  renderMenu: function() {
    var menu = this.props.menu;

    if (!menu) {
      return null;
    }

    var className = [
      'layout-menu',
      'layout-content',
      'layout-content-overflow-scroll'
    ];
    if (this.props.header) {
      className.push('layout-content-has-header');
    }
    if (this.props.footer) {
      className.push('layout-content-has-footer');
    }
    className = className.join(' ');

    return (
      /* jshint ignore:start */
      <div className={className} ref='menu'>
        <div className='layout-content-scroll'>
          {menu}
        </div>
      </div>
      /* jshint ignore:end */
    );
  },

  renderFooter: function() {
    var footer = this.props.footer;

    if (!footer) {
      return null;
    }

    return (
      /* jshint ignore:start */
      <div className='layout-footer'>
        {footer}
      </div>
      /* jshint ignore:end */
    );
  },

  scrollToContentTop: function() {
    var node = this.refs.content.getDOMNode();
    node.scrollTop = 0;
  },

  scrollToContentBottom: function() {
    var node = this.refs.content.getDOMNode();
    node.scrollTop = node.scrollHeight;
  }
});

module.exports = Layout;
