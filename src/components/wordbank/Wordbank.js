/**
 * @jsx React.DOM
 */

/*
 == BSD2 LICENSE ==
 Copyright (c) 2015, Tidepool Project

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
var _ = require('lodash');
var dataHelper = require('../../core/userDataHelper');

require('./Wordbank.less');

var Wordbank = React.createClass({
  renderWord: function(tag, index) {
    return (
      /* jshint ignore:start */
      <button
        className='wordbank-word'
        key={index}>
        {tag}
      </button>
      /* jshint ignore:end */
    );
  },
  renderWords: function() {
    var wordbank = dataHelper.getWordbankWords(this.props.userid, this.props.notes);
    var words = _.map(wordbank, function(word, index) {
      return this.renderWord(word, index);
    }.bind(this));

    return words;
  },
  render: function() {
    var words = this.renderWords();

    return (
      /* jshint ignore:start */
      <div ref='wordbank' className='wordbank'>
      {words}
      </div>
      /* jshint ignore:end */
    );
  }
});

module.exports = Wordbank;
