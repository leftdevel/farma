var React = require('react');

var MapValidator = require('../../lib/validator/map-validator');
var UserActions = require('../../actions/user-actions');
var Form = require('./common/form');
var ValidationSchema = require('./common/validation-schema');
var Text = require('../core/form/text');
var UserStore = require('../../stores/user-store');

var FormMixin = require('./common/form-mixin');

var Create = React.createClass({
    mixins: [FormMixin],

    render: function() {
        var fields = this.props.fields;

        return (
            <Form
                fields={fields}
                changeHandler={this.props.changeHandler}
                title="Nuevo Usuario"
                submitLabel="Crear"
                submitHandler={this.props.submitHandler}>

                <Text
                    inputType="password"
                    id="password"
                    label="Contraseña"
                    value={fields.password.value}
                    changeHandler={this.props.changeHandler}
                    error={fields.password.error} />

                <Text
                    inputType="password"
                    id="repeat_password"
                    label="Confirmar Contraseña"
                    value={fields.repeat_password.value}
                    changeHandler={this.props.changeHandler}
                    error={fields.repeat_password.error} />
            </Form>
        );
    },

    getMapValidator: function() {
        var mapValidator = new MapValidator();
        var fields = this.props.fields;

        mapValidator
            .addValidatorForPath('full_name', ValidationSchema.getFullNameValidator(fields.full_name.value))
            .addValidatorForPath('email', ValidationSchema.getEmailValidator(fields.email.value))
            .addValidatorForPath('password', ValidationSchema.getPasswordValidator(fields.password.value))
            .addValidatorForPath('repeat_password',
                ValidationSchema.getRepeatPasswordValidator(fields.repeat_password.value, fields.password.value))
        ;

        return mapValidator;
    },
});

module.exports = Create;