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

});