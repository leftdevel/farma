var React = require('react');
var assign = require('object-assign');

// Components
var Form = require('./common/form');
var Text = require('../core/form/text');
var Wrapper = require('../wrapper');

// Utils
var BaseCreateEdit = require('./common/base-create-edit');
var UserActions = require('../../actions/user-actions');

// Validation
var MapValidator = require('../../lib/validator/map-validator');
var ValidationSchema = require('./common/validation-schema');

var Create = React.createClass(assign({}, BaseCreateEdit.prototype, {
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            fields: this.getDefaultFields()
        };
    },

    render: function() {
        var fields = this.state.fields;

        return (
            <Wrapper title="Usuarios del Sistema - Crear Nuevo">
                <Form
                    fields={fields}
                    changeHandler={this.changeHandler}
                    title="Nuevo Usuario"
                    submitLabel="Crear"
                    submitHandler={this.submitHandler}>

                    <Text
                        inputType="password"
                        id="password"
                        label="Contraseña"
                        value={fields.password.value}
                        changeHandler={this.changeHandler}
                        error={fields.password.error} />

                    <Text
                        inputType="password"
                        id="repeat_password"
                        label="Confirmar Contraseña"
                        value={fields.repeat_password.value}
                        changeHandler={this.changeHandler}
                        error={fields.repeat_password.error} />
                </Form>
            </Wrapper>
        );
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

    _sendUserAction: function() {
        var entity = this._getFormEntity();
        UserActions.createUser(entity);
    },

    _getFormEntity: function() {
        var fields = this.state.fields;
        var entity = {};

        entity.full_name = fields.full_name.value;
        entity.email = fields.email.value;
        entity.roles = [fields.role.value]; // Backend API expects array
        entity.password = fields.password.value;

        return entity;
    },

}));

module.exports = Create;