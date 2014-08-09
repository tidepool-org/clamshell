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

var helpers = require('../lib/helpers');
var MessageForm = require('../../src/components/form/MessageForm');

var sundial = require('sundial');

describe('MessageForm', function() {
  var component;

  afterEach(function() {
    helpers.unmountComponent();
  });

  describe('when initialised', function() {
    beforeEach(function() {
      component = helpers.mountComponent(MessageForm());
    });

    it('does not have a cancel button', function() {
      expect(component.refs.cancelBtn).to.not.exist;
    });
    it('does not have a send button', function() {
      expect(component.refs.sendBtn).to.not.exist;
    });
    it('has text input', function() {
      expect(component.refs.messageText).to.exist;
    });
    it('text input should only be one line when not editing', function() {
      expect(component.refs.messageText.getDOMNode().rows).to.equal(1);
    });
    it('should not show the message time by defaut', function() {
      expect(component.refs.showDateTime).to.not.exist;
    });
  });

  describe('when has focus and adding a new message', function() {
    beforeEach(function() {
      component = helpers.mountComponent(MessageForm());
      component.refs.messageText.props.onFocus();
    });

    it('text input should be 3 lines', function() {
      expect(component.refs.messageText.getDOMNode().rows).to.equal(3);
    });

    it('the state will be editing', function() {
      expect(component.state.editing).to.be.true;
    });

    it('the timestamp will be initialised', function() {
      expect(component.state.whenUtc).to.exist;
    });

    it('will show a send button', function() {
      expect(component.refs.sendBtn).to.exist;
    });
    it('will show a cancel button', function() {
      expect(component.refs.cancelBtn).to.exist;
    });

    it('and we have showed the editable date will allow the date to be edited', function() {
      component.showEditDate();
      expect(component.allowDateEdit()).to.true;
    });

  });

  describe('when saving a new message', function() {
    beforeEach(function() {
      component = helpers.mountComponent(MessageForm());
      component.refs.messageText.props.onFocus();
    });

    it('gives submitted msg and timestamp to handler', function() {
      var myTestMessage = 'should get this message text';
      var theTime = sundial.utcDateString();

      var handleMessage = sinon.spy();
      component.setProps({
        onSubmit: handleMessage
      });
      //set the message and time
      component.setState({
        msg: myTestMessage,
        whenUtc : theTime
      });
      //save it
      var save = component.refs.sendBtn.props.onClick;
      save();

      expect(handleMessage).to.have.been.calledWith({text: myTestMessage, timestamp: theTime});
    });

    it('gives submitted msg and timestamp to handler when we have allowed the editing of the date', function() {
      var myTestMessage = 'should get this message text 2';

      var handleMessage = sinon.spy();
      component.setProps({
        onSubmit: handleMessage
      });

      /*
       * Allow date editing which will set the date and time components
       */
      component.showEditDate();
      //set the message and time
      component.setState({
        msg: myTestMessage,
        whenUtc : sundial.utcDateString()
      });
      var expectedTimestamp = component.getUtcTimestamp();
      //save it
      var save = component.refs.sendBtn.props.onClick;
      save();

      expect(handleMessage).to.have.been.calledWith({text: myTestMessage, timestamp: expectedTimestamp});
    });

  });

  describe('when canceling', function() {
    beforeEach(function() {
      component = helpers.mountComponent(MessageForm());
      component.refs.messageText.props.onFocus();
    });

    it('resets to default state', function() {
      var cancel = component.refs.cancelBtn.props.onClick;
      cancel();

      expect(component.refs.sendBtn).to.not.exist;
      expect(component.refs.cancelBtn).to.not.exist;
      expect(component.refs.showDateTime).to.not.exist;
      expect(component.state.msg).to.be.empty;
      expect(component.state.whenUtc).to.not.exist;
      expect(component.state.date).to.not.exist;
      expect(component.state.time).to.not.exist;
      expect(component.state.editing).to.be.false;
      expect(component.state.changeDateTime).to.be.false;
    });

  });

  describe('when editing an existing note\'s text and timestamp', function(){

    var fields = {editableText: 'existing note text', editableTimestamp: sundial.utcDateString() };
    //isExistingNoteEdit
    beforeEach(function() {
      component = helpers.mountComponent(
        MessageForm(
          {existingNoteFields:fields}
        )
      );
    });

    it('the form is initialised as such', function() {

      expect(component.state.editing).to.be.true;
      expect(component.state.changeDateTime).to.be.true;
      expect(component.state.msg).to.equal(fields.editableText);
      expect(component.state.whenUtc).to.equal(fields.editableTimestamp);
      expect(component.state.time).to.exist;
      expect(component.state.date).to.exist;
    });

    it('the form knows it is an existing edit', function() {
      expect(component.isExistingNoteEdit()).to.be.true;
    });

    it('the form knows there is text to edit', function() {
      expect(component.hasTextToEdit()).to.be.true;
    });

    it('the form knows there is a timestamp to edit', function() {
      expect(component.hasTimestampToEdit()).to.be.true;
    });

    it('the form we are allowing the date to be edited', function() {
      expect(component.allowDateEdit()).to.be.true;
    });
  });

  describe('when editing existing note\'s text only', function(){

    var fields = {editableText: 'existing note text', displayOnlyTimestamp: sundial.utcDateString() };
    //isExistingNoteEdit
    beforeEach(function() {
      component = helpers.mountComponent(
        MessageForm(
          {existingNoteFields:fields}
        )
      );
    });

    it('the form is initialised as such', function() {

      expect(component.state.editing).to.be.true;
      expect(component.state.changeDateTime).to.be.false;
      expect(component.state.msg).to.equal(fields.editableText);
      expect(component.state.whenUtc).to.equal(fields.displayOnlyTimestamp);
      expect(component.state.time).to.not.exist;
      expect(component.state.date).to.not.exist;
    });

    it('the form knows it is an edit', function() {
      expect(component.isExistingNoteEdit()).to.be.true;
    });

    it('the form knows there is text to edit', function() {
      expect(component.hasTextToEdit()).to.be.true;
    });

    it('the form knows there is NO timestamp to edit', function() {
      expect(component.hasTimestampToEdit()).to.be.false;
    });

    it('the form we are NOT allowing the date to be edited', function() {
      expect(component.allowDateEdit()).to.be.false;
    });

  });

});
