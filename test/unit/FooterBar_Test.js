var chai = require('chai');
var expect = chai.expect;
var React = require('react');

var FooterBar = require('../../build/components/FooterBar');


var handled = false;

var actionHandeled = function(){
    handled = true;
};

var testTitle = 'Do Something';


describe('FooterBar', function() {
    var component, container;

    beforeEach(function() {
        //we add our component to test into a div and then render it
        component = FooterBar({
            actionName : testTitle,
            onActionHandled : actionHandeled
        });

        container = document.createElement('div');
        document.documentElement.appendChild(container);
        React.renderComponent(component, container);

    });

    afterEach(function() {
        React.unmountComponentAtNode(container);
        document.documentElement.removeChild(container);
    });

    it('should an action button', function() {
        var actionBtn = component.refs.actionBtn;
        expect(actionBtn).to.exist;
    });

    it('should give displayed text', function() {
        var theTitle = component.props.actionName;
        expect(theTitle).to.equal(testTitle);
    });

    it('should call actionHandeled action button clicked', function() {
        component._renderedComponent.props.children.props.onClick();
        expect(handled).to.be.true;
    });

});