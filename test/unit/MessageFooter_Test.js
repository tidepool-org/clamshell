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

var MessageFooter = require('../../build/components/footer/MessageFooter');
var helpers = require('../lib/helpers');

var submittedMessage;

var getSubmittedMessage = function(content){
  submittedMessage = content.text;
};

describe('MessageFooter', function() {
  var component, container;

  beforeEach(function() {
    component = helpers.mountComponent(
      MessageFooter({onFooterAction:getSubmittedMessage})
    );
  });

  afterEach(function() {
    helpers.unmountComponent();
  });

  it('should exist', function() {
    expect(component).to.exist;
    expect(component.refs).to.exist;
  });

  it('should have a send button reference', function() {
    var sendBtn = component.refs.sendBtn;
    expect(sendBtn).to.exist;
  });

  it('should have a message text reference', function() {
    var messageText = component.refs.messageText;
    expect(messageText).to.exist;
  });

  it('should give the submitted message text via the handler', function() {

    var myTestMessage = 'should be this message text I see';
    component.refs.messageText.getDOMNode().value = myTestMessage;
    component.handleMessage();

    expect(submittedMessage).to.equal(myTestMessage);
  });

});