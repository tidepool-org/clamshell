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
var TeamPicker = require('../../src/components/menu/TeamPicker');

describe('TeamPicker', function() {
  var component;

  beforeEach(function() {
    var loggedInUser = {
      userid: '1',
      profile: {fullName: 'User1'},
      notes: [],
      teams: [
        {
          userid: '2',
          profile: {fullName: 'User2'},
          notes: []
        }
      ]
    };
    component = helpers.mountComponent(
      TeamPicker({
        loggedInUser: loggedInUser,
        onUserPicked: function() {}
      })
    );
  });

  afterEach(function() {
    helpers.unmountComponent();
  });

  it('should have a user list', function() {
    var userList = component.refs.users;
    expect(userList).to.exist;
  });

  it('should show logged in user and teams in user list', function() {
    var userNodes = component.refs.users.props.children;
    expect(userNodes.length).to.equal(2);
  });

  it('should call handler with the id of the choosen user', function() {
    var handleUserPicked = sinon.spy();
    component.setProps({
      onUserPicked: handleUserPicked
    });

    component.refs.users.props.children[0].props.onClick();

    expect(handleUserPicked).to.have.been.calledWith('1');
  });

});
