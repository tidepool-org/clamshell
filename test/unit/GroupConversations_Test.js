var chai = require('chai');
var expect = chai.expect;
var React = require('react');

var GroupConversations = require('../../build/components/GroupConversations');
var groups = require('../../demo/data').groups;

var handlerCalled = false;

var handleThreadSelected = function(props, key){
    console.log('props: ',props);
    console.log('key: ',key);
    handlerCalled = true;
};

describe('GroupConversations', function() {
    var component, container;

    beforeEach(function() {
        //we add our component to test into a div and then render it
        component = GroupConversations({groups:groups,onThreadSelected:handleThreadSelected});

        container = document.createElement('div');
        document.documentElement.appendChild(container);
        React.renderComponent(component, container);

    });

    afterEach(function() {
        React.unmountComponentAtNode(container);
        document.documentElement.removeChild(container);
    });

    it('should have method to get a summary of the content of the most recent message', function() {
        expect(component.summaryForMessage).to.exist;
    });

    it('should give the first ten words for summaryForMessage', function() {
        var summary = component.summaryForMessage('this is more than 10 words to see that it will give me a summary only');
        expect(summary).to.equal('this is more than 10 words to see that it ...');
    });

    it('should give the full message if it is under 10 words summaryForMessage', function() {
        var shortTestMessage = 'to the point';
        var summary = component.summaryForMessage(shortTestMessage);
        expect(summary).to.equal(shortTestMessage);
    });

    it('should have method to get a nice time for display from the timestamp', function() {
        expect(component.niceTime).to.exist;
    });

    it('should have return the date to be displayed', function() {
        var dateString = '2013-12-24T23:07:40+00:00';
        var dateToDisplay = component.niceTime(dateString); 
        expect(dateToDisplay).to.equal(dateString);
    });

    it('should call handler for group selection when a child group items is clicked', function() {
        //call the onClick of first groupitem that is a child of our component
        component._renderedComponent.props.children[0].props.onClick();
        expect(handlerCalled).to.be.true;
    });

    it('should return two converstaion threads', function() {
        //call the onClick of first groupitem that is a child of our component
        var group = groups[0];
        var converstions = component.conversationsForGroup(group);
        expect(converstions.length).to.equal(2);
    });

    it('should have two converstaion overviews where the key is the id for the root message of each thread', function() {
        //call the onClick of first groupitem that is a child of our component
        var group = groups[0];
        var converstions = component.conversationsForGroup(group);

        expect(converstions[0].props.key).to.equal('9233c2ae-7bad-41f5-9295-e73f0437295b');
        expect(converstions[1].props.key).to.equal('070159bf-bd33-4998-b874-6b9c2bafe7fb');
        
    });

});