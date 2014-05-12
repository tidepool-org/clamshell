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

  beforeEach(function() {
    component = helpers.mountComponent(MessageForm());
  });

  afterEach(function() {
    helpers.unmountComponent();
  });

  it('should have a send button', function() {
    var sendBtn = component.refs.sendBtn;
    expect(sendBtn).to.exist;
  });

  it('should have a message text input', function() {
    var messageText = component.refs.messageText;
    expect(messageText).to.exist;
  });

  it('should pass the submitted message text to the given handler', function() {
    var myTestMessage = 'should get this message text';

    var handleMessage = sinon.spy();
    component.setProps({
      onSubmit: handleMessage
    });
    component.setState({
      value: myTestMessage
    });
    var clickPost = component.refs.sendBtn.props.onClick;
    clickPost();

    expect(handleMessage).to.have.been.calledWith({text: myTestMessage});
  });
});
