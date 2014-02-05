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

var chai = require('chai');
var expect = chai.expect;
var React = require('react');

var Note = require('../../build/components/Note');

var testGroupName = 'My Test Group';
var testAuthor = 'Jamie';
var testNote = 'A summary of the latest note to my care group conversation thread';
var testWhenTheLatestNoteOccured = 'Dec 24';

describe('Note', function() {
    var component, container;

    beforeEach(function() {
        //we add our component to test into a div and then render it
        component = Note({
            name : testGroupName,
            author : testAuthor,
            note : testNote,
            when : testWhenTheLatestNoteOccured
        });

        container = document.createElement('div');
        document.documentElement.appendChild(container);
        React.renderComponent(component, container);

    });

    afterEach(function() {
        React.unmountComponentAtNode(container);
        document.documentElement.removeChild(container);
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

    it('should have a show thread section', function() {
        expect(component.refs.showMessageThread).to.not.be.empty;
    });

});