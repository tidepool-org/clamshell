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
var _ = require('lodash');

require('./TeamNotes.less');

var Note = require('./Note');

var dataHelper = require('../../core/userDataHelper');

var TeamNotes = React.createClass({

  propTypes: {
    notes : React.PropTypes.array,
    loggedInId : React.PropTypes.string,
    onThreadSelected : React.PropTypes.func
  },

  buildViewableNotes:function(rawNotes){

    var viewableNotes = _.map(rawNotes, function(note){
      return (
        /* jshint ignore:start */
        <Note
          ref='teamNote'
          image='large'
          key={note.id}
          theNote={note}
          loggedInId={this.props.loggedInId}
          onSelect={this.props.onThreadSelected.bind(null, note)}/>
        /* jshint ignore:end */
      );
    }.bind(this));

    return viewableNotes;
  },
  prepareNotes : function (){
    if(_.isEmpty(this.props.notes)){
      return null;
    }
    //filter
    var rawNotes = dataHelper.filterNotes(this.props.notes);
    //order them
    rawNotes = dataHelper.sortNotesDescending(rawNotes);
    //return viewable notes
    return this.buildViewableNotes(rawNotes);
  },

  render: function() {

    var notes = this.prepareNotes();

    return (
      /* jshint ignore:start */
      <div className='teamnotes'>
        {notes}
      </div>
      /* jshint ignore:end */
    );
  }
});

module.exports = TeamNotes;
