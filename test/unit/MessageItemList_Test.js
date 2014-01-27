var chai = require('chai');
var expect = chai.expect;
var React = require('react');

var MessageItemList = require('../../build/components/MessageItemList');
var groups = require('../../demo/data').groups;

describe('MessageItemList', function() {
    var component, container;

    beforeEach(function() {

        var messages = groups[0].messages;
        //we add our component to test into a div and then render it
        component = MessageItemList({messages:messages});

        container = document.createElement('div');
        document.documentElement.appendChild(container);
        React.renderComponent(component, container);

    });

    afterEach(function() {
        React.unmountComponentAtNode(container);
        document.documentElement.removeChild(container);
    });

    it('should have messages', function() {
        expect(component.props.messages).to.exist;
    });

    it('should have a messageThread', function() {
        expect(component.refs.messageThread).to.exist;
    });

    it('the messageThread will have has many items as there are messages', function() {

        var numMessageThreadItems = component.refs.messageThread.props.children.length;
        var numOfMessages = component.props.messages.length;

        expect(numMessageThreadItems).to.equal(numOfMessages);
    });

    it('message will have an authorName', function() {
        expect(component.refs.authorName).to.exist;
    });

    it('message will have an authorImage', function() {
        expect(component.refs.authorImage).to.exist;
    });

    it('message will have when it was written', function() {
        expect(component.refs.messageWhen).to.exist;
    });

    it('message will have what was written', function() {
        expect(component.refs.messageText).to.exist;
    });

});