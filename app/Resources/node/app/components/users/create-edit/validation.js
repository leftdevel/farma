var Validator = require('../../../lib/validator/validator');
var MapValidator = require('../../../lib/validator/map-validator');
var Constraints = require('../../../lib/validator/constraints/core');

module.exports = {
    validate: function(form) {
        var mapValidator = new MapValidator();

        mapValidator
            .addValidatorForPath('full_name', new Validator(form.full_name, [
                Constraints.NotBlank('Llene este campo')
            ]))
            .addValidatorForPath('email', new Validator(form.email, [
                Constraints.NotBlank('Llene este campo')
            ]))
            .addValidatorForPath('password', new Validator(form.password, [
                Constraints.NotBlank('Llene este campo')
            ]))
            .addValidatorForPath('repeat_password', new Validator(form.repeat_password, [
                Constraints.NotBlank('Llene este campo'),
                Constraints.Match(form.password, 'Constraseñas deben coincidir')

            ]))
            .validateAll()
        ;

        return mapValidator;
    }
};