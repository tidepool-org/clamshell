var chai = require('chai');
var expect = chai.expect;
var React = require('react');

var MessageItem = require('../../build/components/MessageItem');

var testWho = 'Jamie Bate';
var testNoteText = 'A summary of the latest note to my care group';
var testWhenNoteOccured = 'Dec 24';

describe('MessageItem', function() {
    var component, container;

    beforeEach(function() {
        //we add our component to test into a div and then render it
        component = MessageItem({
            who : testWho,
            messageText : testNoteText,
            when : testWhenNoteOccured
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
        expect(component.props.who).to.equal(testWho);
    });

    it('should have property for the note text', function() {
        expect(component.props.messageText).to.equal(testNoteText);
    });

    it('should have property for when note occured', function() {
        expect(component.props.when).to.equal(testWhenNoteOccured);
    });

    it('should have a who sent the message section', function() {
        expect(component.refs.messageWho).to.not.be.empty;
    });

    it('should have a when the message was section', function() {
        expect(component.refs.messageWhen).to.not.be.empty;
    });

    it('should have a message text section', function() {
        expect(component.refs.messageText).to.not.be.empty;
    });

});