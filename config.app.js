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

var pkg = require('./package.json');

function booleanFromText(value, defaultValue) {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return defaultValue || false;
}

module.exports = {
  VERSION: pkg.version,
  MOCK: booleanFromText(__MOCK__, false),
  API_HOST: __API_HOST__ || 'https://dev-api.tidepool.org',
  LONGTERM_KEY: __LONGTERM_KEY__ || 'abcdefghikjlmnopqrstuvwxyz'
};
