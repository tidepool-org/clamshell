var chai = require('chai');
var expect = chai.expect;
var React = require('react');

var Login = require('../../build/components/Login');

var loggedIn = false;

var handleLoginSuccess  = function(){
    loggedIn = true;
};

var loginFake  = function(username,password,cb){
    cb(username,password);
};

describe('Login', function() {
    var component, container;

    beforeEach(function() {
        //we add our component to test into a div and then render it
        component = Login({
            login : loginFake,
            onLoginSuccess : handleLoginSuccess
        });

        container = document.createElement('div');
        document.documentElement.appendChild(container);
        React.renderComponent(component, container);

    });

    afterEach(function() {
        React.unmountComponentAtNode(container);
        document.documentElement.removeChild(container);
    });

    it('should have a login button', function() {
        var loginBtn = component.refs.loginBtn;
        expect(loginBtn).to.exist;
    });

    it('should take a users email', function() {
        var email = component.refs.emailFeild;
        expect(email).to.exist;
    });

    it('should take a users password', function() {
        var pw = component.refs.pwFeild;
        expect(pw).to.exist;
    });

    it('should fire onLoginSuccess handler when called', function() {
        expect(loggedIn).to.be.false;
        component.props.onLoginSuccess();
        expect(loggedIn).to.be.true;
    });

    it('should use login handler when submit clicked', function() {
        
        var fakeUn = 'fake.user@go.org';
        var fakePw = 'f@k31t';

        component.props.login(fakeUn,fakePw,function(givenUser,givenPw){
            expect(givenPw).to.equal(fakePw);
            expect(givenUser).to.equal(fakeUn);
        });
    });

    it('should fail validation and return a message with no email', function() {
        var err = component.validate('','pa55w0rd');
        expect(err).to.equal('Missing email.');
    });

    it('should fail validation and return a message with no pw', function() {
        var err = component.validate('test.user@test.com','');
        expect(err).to.equal('Missing password.');
    });

    it('should fail validation and return a message with no pw and email', function() {
        var err = component.validate('','');
        expect(err).to.equal('Missing email and password.');
    });

    it('should pass validation when given details', function() {
        var err = component.validate('test.user@test.com','pa55w0rd');
        expect(err).to.be.empty;
    });

    it('should have a loggingIn state', function() {
        var loggingInState = component.state.loggingIn;
        expect(loggingInState).to.exist;
    });

    it('should have a message in state', function() {
        var messageState = component.state.message;
        expect(messageState).to.exist;
    });

});