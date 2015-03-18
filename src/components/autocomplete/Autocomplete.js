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

require('./Autocomplete.less');

// utility function that return the word in a string at the specified position
var getWordAt = function(string, position) {
  // Search for the word's beginning and end.
  var left = string.slice(0, position).search(/\S+$/);
  var right = string.slice(position).search(/\s/);

  // The last word in the string is a special case.
  if (right < 0) {
    return string.slice(left);
  }

  // Return the word, using the located bounds to extract it from the string.
  return string.slice(left, right + position);
};

var Autocomplete = React.createClass({
  renderListItem: function(tag) {
    return (
      /* jshint ignore:start */
      <li key={tag}>
        <a href='#'>
          {tag}
        </a>
      </li>
      /* jshint ignore:end */
    );
  },
  renderWordList: function() {
    if (this.props.messageText) {
      var messageTextNode = this.props.messageText.getDOMNode();
      if (messageTextNode) {
        var currentWord = getWordAt(messageTextNode.value, messageTextNode.selectionStart);
        if (currentWord.length !== 0 && currentWord[0] === '#') {
          var matches = _.filter(this.props.words, function (word) {
            return word.toLowerCase().substring(0, currentWord.length) === currentWord;
          });
          if (matches.length > 0) {
            var listItems = _.map(matches, function (match, index) {
              return this.renderListItem(match, index);
            }.bind(this));

            return (
              /* jshint ignore:start */
              <ul>
                {listItems}
              </ul>
              /* jshint ignore:end */
            );
          }
        }
      }
    }
  },
  render: function() {
    var wordList = this.renderWordList();

    return (
      /* jshint ignore:start */
      <div ref='autocomplete' className='autocomplete'>
        {wordList}
      </div>
      /* jshint ignore:end */
    );
  }
});

module.exports = Autocomplete;
