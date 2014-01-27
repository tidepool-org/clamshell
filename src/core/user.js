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

var _ = require('underscore');

var user = {
    validate: function(attributes, options) {
        options = options || {};
        var ignoreMissingAttributes = true;
        if (options.ignoreMissingAttributes === false) {
            ignoreMissingAttributes = false;
        }
        var errors = {};

        var needsValidation = function(attributeName) {
            if (ignoreMissingAttributes && !_.has(attributes, attributeName)) {
                return false;
            }
            return true;
        };

        if (needsValidation('username')) {
            errors.username = this.validateRequired(attributes.username);
        }
        if (needsValidation('password')) {
            errors.password = this.validateRequired(attributes.password);
        }

        // Filter "empty" errors
        errors = _.transform(errors, function(result, value, key) {
            if (value) {
                result[key] = value;
            }
        });

        return errors;
    },

    validateRequired: function(value) {
        if (!value) {
            return 'This field is required.';
        }
    }
};

module.exports = user;