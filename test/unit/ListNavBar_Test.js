var chai = require('chai');
var expect = chai.expect;
var React = require('react');

var ListNavBar = require('../../build/components/ListNavBar');


var handled = false;

var actionHandeled = function(){
    handled = true;
};

var testTitle = 'My Test NavBar';


describe('ListNavBar', function() {
    var component, container;

    beforeEach(function() {
        //we add our component to test into a div and then render it
        //onLogoutSuccess={this.handleLogoutSuccess} logout={app.auth.logout.bind(app.auth)
        component = ListNavBar({
            title : testTitle,
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

    it('should give the title to be what we set it as', function() {
        var theTitle = component.props.title;
        expect(theTitle).to.equal(testTitle);
    });

    it('should call actionHandeled action button clicked', function() {
        component._renderedComponent.props.children[0].props.onClick();
        expect(handled).to.be.true;
    });

});