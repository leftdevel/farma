var Validator = require('../../../../lib/validator/validator');
var Constraints = require('../../../../lib/validator/constraints/core');

module.exports = {
    getNotBlankValidator: function(value) {
        return new Validator(value, [Constraints.NotBlank('Llene este campo')]);
    },

    getPriceValidator: function(price) {
        return new Validator(price, [
            Constraints.NotBlank('Llene este campo'),
            Constraints.StringIsNumeric('Sólo números. Ej: 10.20'),
            Constraints.GreaterThanOrEqual(0, 'Ingrese un número igual o mayor que cero')
        ]);

    },

    getCostValidator: function(cost) {
        return new Validator(cost, [
            Constraints.StringIsNumeric('Sólo números. Ej: 10.50'),
            Constraints.GreaterThanOrEqual(0, 'Ingrese un número igual o mayor que cero')
        ], true);

    },

    getQuantityValidator: function(quantity) {
        return new Validator(quantity, [
            Constraints.NotBlank('Llene este campo'),
            Constraints.StringIsInteger('Sólo números enteros sin puntos ni comas. Ej: 100'),
            Constraints.GreaterThanOrEqual(0, 'Ingrese un número igual o mayor que cero')
        ]);

    }

};