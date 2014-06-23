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

describe('MessageForm', function() {
  var component;

  afterEach(function() {
    helpers.unmountComponent();
  });

  describe('by default', function() {
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

  describe('when message form has focus', function() {
    beforeEach(function() {
      component = helpers.mountComponent(MessageForm());
      component.refs.messageText.props.onFocus();
    });

    it('will set it to be in edit mode', function() {
      expect(component.refs.sendBtn).to.exist;
    });

    it('will set it to be in edit mode', function() {
      expect(component.refs.sendBtn).to.exist;
    });

    it('will show a send button', function() {
      expect(component.refs.sendBtn).to.exist;
    });
    it('will show a cancel button', function() {
      expect(component.refs.cancelBtn).to.exist;
    });

  });

  describe('on saving', function() {
    beforeEach(function() {
      component = helpers.mountComponent(MessageForm());
      component.refs.messageText.props.onFocus();
    });

    it('gives submitted msg and timestamp to handler', function() {
      var myTestMessage = 'should get this message text';
      var theTime = new Date().toISOString();

      var handleMessage = sinon.spy();
      component.setProps({
        onSubmit: handleMessage
      });

      component.setState({
        msg: myTestMessage,
        whenUtc : theTime
      });
      var save = component.refs.sendBtn.props.onClick;
      save();

      expect(handleMessage).to.have.been.calledWith({text: myTestMessage, timestamp: theTime});
    });

  });

  describe('on canceling', function() {
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

});
