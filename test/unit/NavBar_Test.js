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

var NavBar = require('../../build/components/NavBar');


var logoutHandled = false;

var handleLogoutSuccess = function(){
    logoutHandled = true;
};

var doLogout = function(callback){
    callback();
};


describe('NavBar', function() {
    var component, container;

    beforeEach(function() {
        //we add our component to test into a div and then render it
        //onLogoutSuccess={this.handleLogoutSuccess} logout={app.auth.logout.bind(app.auth)
        component = NavBar({
            onLogoutSuccess : handleLogoutSuccess,
            logout : doLogout
        });

        container = document.createElement('div');
        document.documentElement.appendChild(container);
        React.renderComponent(component, container);

    });

    afterEach(function() {
        React.unmountComponentAtNode(container);
        document.documentElement.removeChild(container);
    });

    it('should a signout button', function() {
        var sigoutBtn = component.refs.signOutBtn;
        expect(sigoutBtn).to.exist;
    });

    it('should a handle signout on click', function() {
        component.refs.signOutBtn._renderedComponent.props.onClick();
        expect(logoutHandled).to.be.true;
    });

    it('should call onLogoutSuccess when handling the logout', function() {
        component.handleLogout();
        expect(logoutHandled).to.be.true;
    });

});