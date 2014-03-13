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

var chai = require('chai');
var expect = chai.expect;
var React = require('react');

var Note = require('../../build/components/notes/Note');

var testGroupName = 'My Test Group';
var testAuthor = 'Jamie';
var testNote = 'A summary of the latest note to my care group conversation thread';
var testWhenTheLatestNoteOccured = 'Dec 24';
var testImgCols = 'col-2';
var testDetailCols = 'col-10';

describe('Note', function() {
  var component, container;

  beforeEach(function() {
    //we add our component to test into a div and then render it
    component = new Note({
      name : testGroupName,
      author : testAuthor,
      note : testNote,
      when : testWhenTheLatestNoteOccured,
      imgColumns : testImgCols,
      detailColumns : testDetailCols
    });

    container = document.createElement('div');
    document.documentElement.appendChild(container);
    React.renderComponent(component, container);

  });

  afterEach(function() {
    React.unmountComponentAtNode(container);
    document.documentElement.removeChild(container);
  });

  it('should have method to format the time', function() {
    expect(component.niceTime).to.exist;
  });

  it('should formated time will be friendly', function() {
    var formattedTime = component.niceTime('2013-12-22T23:07:40+00:00');
    expect(formattedTime).to.equal('12/23/2013');
  });

  it('should have a property for imgColumns', function() {
    expect(component.props.imgColumns).to.exist;
  });

  it('should have a property for detailColumns', function() {
    expect(component.props.detailColumns).to.exist;
  });

  it('should have a ref for imgColumn', function() {
    expect(component.refs.imgColumn).to.exist;
  });

  it('should have a ref for detailColumn', function() {
    expect(component.refs.detailColumn).to.exist;
  });

  it('detailColumn class set', function() {
    expect(component.refs.detailColumn.props.className).equal(testDetailCols);
  });

  it('imgColumn class set', function() {
    expect(component.refs.imgColumn.props.className).equal(testImgCols);
  });

  it('should have a property for detailColumn', function() {
    expect(component.refs.detailColumn).to.exist;
  });

  it('should have property for the group name', function() {
    expect(component.props.name).to.equal(testGroupName);
  });

  it('should have property for the note', function() {
    expect(component.props.note).to.equal(testNote);
  });

  it('should have property for the author', function() {
    expect(component.props.author).to.equal(testAuthor);
  });

  it('should have property for when the most recent note occured', function() {
    expect(component.props.when).to.equal(testWhenTheLatestNoteOccured);
  });

  it('should have a when section', function() {
    expect(component.refs.messageWhen).to.not.be.empty;
  });

  it('should have a message text section', function() {
    expect(component.refs.messageText).to.not.be.empty;
  });

  it('should not show link section by default', function() {
    expect(component.refs.showMessageThread).to.not.exist;
  });

  it('should show link section when it is set',function(){
    var note = new Note({
      name : testGroupName,
      author : testAuthor,
      note : testNote,
      when : testWhenTheLatestNoteOccured,
      imgColumns : testImgCols,
      detailColumns : testDetailCols,
      showCommentLink : true
    });

    var testContainer = document.createElement('div');
    document.documentElement.appendChild(testContainer);
    React.renderComponent(note, testContainer);

    expect(note.refs.showMessageThread).to.exist;
  });

});