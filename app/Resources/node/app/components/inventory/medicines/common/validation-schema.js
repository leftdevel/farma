var Validator = require('../../../../lib/validator/validator');
var Constraints = require('../../../../lib/validator/constraints/core');


module.exports = {
    getNameValidator: function(name) {
        return new Validator(name, [Constraints.NotBlank('Llene este campo')]);
    },

    getGenericValidator: function(generic) {
        return new Validator(generic, [Constraints.NotBlank('Llene este campo')]);
    },

    getPresentationValidator: function(presentation) {
        return new Validator(presentation, [Constraints.NotBlank('Llene este campo')]);
    },

    getPriceValidator: function(price) {
        return new Validator(price, [Constraints.NotBlank('Llene este campo')]);
        // @TODO validate number
    },

    getQuantityValidator: function(quantity) {
        return new Validator(quantity, [Constraints.NotBlank('Llene este campo')]);
        // @TODO validate number
    }

};