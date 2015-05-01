var Validator = require('../../../lib/validator/validator');
var Constraints = require('../../../lib/validator/constraints/core');
var UserStore = require('../../../stores/user-store');

function getCommonEmailConstraints() {
    return [Constraints.NotBlank('Llene este campo')];
}

module.exports = {
    getFullNameValidator: function(fullName) {
        return new Validator(fullName, [Constraints.NotBlank('Llene este campo')]);
    },

    getEmailValidator: function(email) {
        var constraints = getCommonEmailConstraints();

        constraints.push(
            Constraints.UniquePropertyValue('email', UserStore.getUsers(), 'Actualmente en uso, elija uno diferente')
        );

        return new Validator(email, constraints);
    },

    getEditableEmailValidator: function(email) {
        var userIdInEditForm = UserStore.getUserIdInEditForm();

        var userFoundCallback = function(userFound) {
            return userIdInEditForm === userFound.id;
        };

        var constraints = getCommonEmailConstraints();
        constraints.push(
            Constraints.UniquePropertyValue('email', UserStore.getUsers(), 'Actualmente en uso, elija uno diferente', userFoundCallback)
        );

        return new Validator(email, constraints);
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