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
var Note = require('../../src/components/notes/Note');

var loggedInUserid = '123-ur-334';

var note = {
    id : 'note-123',
    userid : '999-ur-100',
    messagetext : 'a note',
    user : { fullName: 'a user' },
    team : { fullName: 'a team'},
    timestamp : new Date().toISOString()
  };

describe('Note', function() {
  var component;

  beforeEach(function() {
    component = helpers.mountComponent(
      Note({
        theNote : note,
        image : 'css-class'
      })
    );
  });

  afterEach(function() {
    helpers.unmountComponent();
  });

  it('should have a ref for imgColumn', function() {
    expect(component.refs.imgColumn).to.exist;
  });
  it('should have a ref for detailColumn', function() {
    expect(component.refs.detailColumn).to.exist;
  });
  it('should show when the message occurred', function() {
    expect(component.refs.messageWhen).to.exist;
  });
  it('should show the content of the message', function() {
    expect(component.refs.messageText).to.exist;
  });
  it('will not show the thread if the property is not set', function() {
    expect(component.refs.showMessageThread).to.not.exist;
  });
  it('should have property for the group name', function() {
    expect(component.state.team).to.equal(note.team.fullName);
  });
  it('should have property for the note', function() {
    expect(component.state.note).to.equal(note.messagetext);
  });
  it('should have the author', function() {
    expect(component.state.author).to.equal(note.user.fullName);
  });
  it('should have the author and group', function() {
    expect(component.refs.messageAuthorAndGroup).to.exist;
  });

  it('edit link is not shown when handler not set', function() {
    expect(component.refs.editNote).to.not.exist;
  });

  it('show link is not shown when handler not set', function() {
    expect(component.refs.showMessageThread).to.not.exist;
  });

  it('should show link section when it is set', function() {

    var handleShow = sinon.spy();
    component.setProps({
      onShowThread: handleShow
    });

    expect(component.refs.showMessageThread).to.exist;

  });

  describe('when the note has an edit handler attached', function() {

    var handleEdit = sinon.spy();

    beforeEach(function() {

      component = helpers.mountComponent(
        Note({
          theNote : note,
          image : 'css-class',
          onSaveEdit: handleEdit
        })
      );
    });

    it('edit link is shown', function() {
      expect(component.refs.editNote).to.exist;
    });

    it('when edit link is clicked editing is now true', function() {
      component.setState({editing:false});
      var edit = component.refs.editNote.props.onClick;
      edit();
      expect(component.state.editing).to.true;
    });

    it('when edit is saved', function() {

      component.setState({editing:false});
      var edit = component.refs.editNote.props.onClick;
      edit();

      var edited = note;
      edited.messagetext = 'an update';
      edited.timestamp = new Date().toISOString();

      component.handleEditSave(edited);
      expect(handleEdit).to.have.been.calledWith(edited);
    });

    it('canceling the edit sets edit state to false', function() {
      var edit = component.refs.editNote.props.onClick;
      edit();

      expect(component.state.editing).to.true;
      component.handleCancelEdit();
      expect(component.state.editing).to.false;

    });

  });

  describe('when its someone elses note', function() {

    beforeEach(function() {
      component = helpers.mountComponent(
        Note({
          theNote : note,
          image : 'css-class'
        })
      );
    });

    it('edit link is not shown', function() {
      expect(component.refs.editNote).to.not.exist;
    });

  });

});
