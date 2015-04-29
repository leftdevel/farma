var React = require('react');

var MapValidator = require('../../lib/validator/map-validator');
var UserActions = require('../../actions/user-actions');
var Form = require('./common/form');
var ValidationSchema = require('./common/validation-schema');
var Text = require('../core/form/text');
var UserStore = require('../../stores/user-store');

module.exports = React.createClass({
    propTypes: {
        fields: React.PropTypes.object.isRequired
    },

    render: function() {
        var fields = this.props.fields;

        return (
            <Form
                fields={fields}
                changeHandler={this._changeHandler}
                title="Nuevo Usuario"
                submitLabel="Crear"
                submitHandler={this._onSubmit}>

                <Text
                    inputType="password"
                    id="password"
                    label="Contraseña"
                    value={fields.password.value}
                    changeHandler={this._changeHandler}
                    error={fields.password.error} />

                <Text
                    inputType="password"
                    id="repeat_password"
                    label="Confirmar Contraseña"
                    value={fields.repeat_password.value}
                    changeHandler={this._changeHandler}
                    error={fields.repeat_password.error} />
            </Form>
        );
    },

    _changeHandler: function(propertyPath, value) {
        UserActions.updateFormValue(propertyPath, value);
    },

    _onSubmit: function() {
        var mapValidator = this._validate();

        if (mapValidator.hasErrors) {
            UserActions.setFormErrors(mapValidator.errors);
            return;
        }

        var entity = UserStore.getFormEntity();
        UserActions.createUser(entity);
    },

    _validate: function() {
        var mapValidator = new MapValidator();
        var fields = this.props.fields;

        mapValidator
            .addValidatorForPath('full_name', ValidationSchema.getFullNameValidator(fields.full_name.value))
            .addValidatorForPath('email', ValidationSchema.getEmailValidator(fields.email.value))
            .addValidatorForPath('password', ValidationSchema.getPasswordValidator(fields.password.value))
            .addValidatorForPath('repeat_password',
                ValidationSchema.getRepeatPasswordValidator(fields.repeat_password.value, fields.password.value))
            .validateAll()
        ;

        return mapValidator;
    },
});