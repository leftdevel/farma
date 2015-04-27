var Constraint = require('./constraint');
var ConstraintException = require('./constraint-exception');

module.exports = {
    NotBlank: function(errorMessage) {
        var checker = function(value) {
          value = value.toString();
          return  value.length > 0;
        };

        var defaultErrorMessage = 'This value should not be blank';
        errorMessage = errorMessage || defaultErrorMessage;

        return new Constraint(errorMessage, checker);
    },

    MinLength: function(minLength, errorMessage) {
        minLength = parseInt(minLength, 10);

        if (isNaN(minLength)) {
            throw new ConstraintException('minLength must be a number', 'MinLength');
        }

        var defaultErrorMessage = 'value should be at least ' + minLength.toString() + ' characters long';
        errorMessage = errorMessage || defaultErrorMessage;

        var checker = function(value) {
            value = value.toString();
            return value.length >= minLength;
        };

        return new Constraint(errorMessage, checker);
    },

    MaxLength: function(maxLength, errorMessage) {
        maxLength = parseInt(maxLength, 10);

        if (isNaN(maxLength)) {
            throw new ConstraintException('maxLength must be a number', 'MaxLength');
        }

        var defaultErrorMessage = 'value cannot be more than ' + maxLength.toString() + ' characters';
        errorMessage = errorMessage || defaultErrorMessage;

        var checker = function(value) {
            value = value.toString();
            return value.length <= maxLength;
        };

        return new Constraint(errorMessage, checker);
    },

    Match: function(valueToMatch, errorMessage) {
        var defaultErrorMessage = 'values must match';
        errorMessage = errorMessage || defaultErrorMessage;

        var checker = function(value) {
            return value === valueToMatch;
        };

        return new Constraint(errorMessage, checker);
    }
};
