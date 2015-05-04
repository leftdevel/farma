var React = require('react');

var MapValidator = require('../../lib/validator/map-validator');
var Form = require('./common/form');
var ValidationSchema = require('./common/validation-schema');
var Text = require('../core/form/text');
var FormMixin = require('./common/form-mixin');

var Wrapper = require('../wrapper');
var _roles = require('../../utils/user-utils').getRoles();

var Create = React.createClass({
    mixins: [FormMixin],

    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return  {
            fields: {
                full_name: {value: '', error: ''},
                email: {value: '', error: ''},
                role: {value: _roles.ROLE_ADMIN, error: ''}, // One role at a time for current version.
                password: {value: '', error: ''},
                repeat_password: {value: '', error: ''}
            }
        };
    },

    render: function() {
        var fields = this.state.fields;

        return (
            <Wrapper title="Usuarios del Sistema - Crear Nuevo">
                <Form
                    fields={fields}
                    changeHandler={this._changeHandler}
                    title="Nuevo Usuario"
                    submitLabel="Crear"
                    submitHandler={this._submitHandler}>

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
            </Wrapper>
        );
    },

    _changeHandler: function(propertyPath, value) {
        var fields = this.state.fields;
        fields[propertyPath].value = value;
        this.setState({fields: fields});
    },

    _submitHandler: function() {
        var mapValidator = this._getMapValidator();
        mapValidator.validateAll();

        if (mapValidator.hasErrors) {
            this._setFormErrors(mapValidator.errors);
            return;
        }

        var entity = this._getFormEntity();

        UserActions.createUser(entity);
        this.transitionTo('/users');
    },

    _getMapValidator: function() {
        var mapValidator = new MapValidator();
        var fields = this.state.fields;

        mapValidator
            .addValidatorForPath('full_name', ValidationSchema.getFullNameValidator(fields.full_name.value))
            .addValidatorForPath('email', ValidationSchema.getEmailValidator(fields.email.value))
            .addValidatorForPath('password', ValidationSchema.getPasswordValidator(fields.password.value))
            .addValidatorForPath('repeat_password',
                ValidationSchema.getRepeatPasswordValidator(fields.repeat_password.value, fields.password.value))
        ;

        return mapValidator;
    },

    _setFormErrors: function(errors) {
        var fields = this.state.fields;

        for (var i in errors) {
            var error = errors[i];
            fields[error.propertyPath].error = error.errorMessage;
        }

        this.setState({fields: fields});
    },

    _getFormEntity: function() {
        var fields = this.state.fields;
        var entity = {};

        entity.full_name = fields.full_name.value;
        entity.email = fields.email.value;
        entity.roles = [fields.role.value]; // Backend API expects array
        entity.password = fields.password.value;

        return entity;
    }
});

module.exports = Create;