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