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

var userHelper = require('../../src/core/userHelper');

describe('userHelper', function() {

    it('returns two errors when no user name or password given', function() {

        var errors = userHelper.validate({username:'',password:''});
        expect(errors).to.exist;
        expect(errors.username).to.exist;
        expect(errors.password).to.exist;
    });

    it('returns one error when user name missing', function() {
        var errors = userHelper.validate({username:'',password:'xxjamiexx'});
        expect(errors).to.exist;
        expect(errors.username).to.exist;
        expect(errors.password).to.not.exist;
    });

    it('returns no errors when user name or password given', function() {
        var errors = userHelper.validate({username:'jamie',password:'xxjamiexx'});
        expect(errors.username).to.not.exist;
        expect(errors.password).to.not.exist;
    });

});