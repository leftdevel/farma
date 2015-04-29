var Validator = require('../../../lib/validator/validator');
var Constraints = require('../../../lib/validator/constraints/core');

module.exports = {
    getFullNameValidator: function(fullName) {
        return new Validator(fullName, [Constraints.NotBlank('Llene este campo')]);
    },

    getEmailValidator: function(email) {
        return new Validator(email, [Constraints.NotBlank('Llene este campo')]);
    },

    getPasswordValidator: function(password) {
        return new Validator(password, [Constraints.NotBlank('Llene este campo')]);
    },

    getRepeatPasswordValidator: function(repeatPassword, password) {
        return new Validator(repeatPassword, [
            Constraints.NotBlank('Llene este campo'),
            Constraints.Match(password, 'Constraseñas deben coincidir')
        ]);
    }
};