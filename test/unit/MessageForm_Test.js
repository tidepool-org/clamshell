var chai = require('chai');
var expect = chai.expect;
var React = require('react');

var MessageForm = require('../../build/components/MessageForm');
var submittedMessage;

var getSubmittedMessage = function(content){
    submittedMessage = content.text;
    console.log('added: ',submittedMessage)
};

describe('MessageForm', function() {
    var component, container;

    beforeEach(function() {
        //we add our component to test into a div and then render it
        component = MessageForm({onMessageSend:getSubmittedMessage});
        container = document.createElement('div');
        document.documentElement.appendChild(container);
        React.renderComponent(component, container);
    });

    afterEach(function() {
        React.unmountComponentAtNode(container);
        document.documentElement.removeChild(container);
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
        component.handleSubmit();

        expect(submittedMessage).to.equal(myTestMessage);
    });

});