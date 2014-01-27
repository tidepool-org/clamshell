var chai = require('chai');
var expect = chai.expect;
var React = require('react');

var ConversationOverview = require('../../build/components/ConversationOverview');

var testGroupName = 'My Test Group';
var testLatestNoteSummary = 'A summary of the latest note to my care group conversation thread';
var testWhenTheLatestNoteOccured = 'Dec 24';

describe('ConversationOverview', function() {
    var component, container;

    beforeEach(function() {
        //we add our component to test into a div and then render it
        component = ConversationOverview({
            name : testGroupName,
            latestNoteSummary : testLatestNoteSummary,
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

    it('should have property for the author', function() {
        expect(component.props.latestNoteSummary).to.equal(testLatestNoteSummary);
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