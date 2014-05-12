/**
 * Copyright (c) 2014, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

'use scrict';

var globals = {
  chai: require('chai'),
  // Can't use `require('sinon')` when not in Node because won't load plugins
  // http://stackoverflow.com/questions/20570301/typeerror-undefined-is-not-a-function-evaluating-sinon-spy
  sinon: window.sinon
};
globals.expect = globals.chai.expect;
var sinonChai = require('sinon-chai');
globals.chai.use(sinonChai);

// Add to global object for all tests to use
window.chai = globals.chai;
window.expect = globals.expect;
window.sinon = globals.sinon;
