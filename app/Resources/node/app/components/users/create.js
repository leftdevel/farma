var React = require('react');
var cx = require('class-set');
var assign = require('object-assign');

var UserActions = require('../../actions/user-actions');

var Text = require('../form/text');
var Select = require('../form/select');
var SubmitCancelButton = require('../form/submit-cancel-button');

var Validator = require('../../lib/validator/validator');
var MapValidator = require('../../lib/validator/map-validator');
var Constraints = require('../../lib/validator/constraints/core');

var UserUtils = require('../../utils/user-utils');
var availableRoles = UserUtils.roles.filter(function(role) {
    return role.value !== 'ROLE_SUPER_ADMIN';
});

function getDefaultState() {
    return {
        errors: {
            full_name: '',
            email: '',
            roles: '',
            password: '',
            repeat_password: '',
        }
    };
}

module.exports = React.createClass({
    propTypes: {
        finishHandler: React.PropTypes.func.isRequired,
        isVisible: React.PropTypes.bool.isRequired
    },

    getInitialState: function() {
        return getDefaultState();
    },

    render: function() {

        var formClassNames = cx({
            'col': true,
            's12': true,
            'hide': !this.props.isVisible
        });

        return (
            <form className={formClassNames}>
                <h5>Nuevo Usuario</h5>
                <Text ref="FullName" id="full_name" label="Nombre" error={this.state.errors.full_name} />
                <Text ref="Email" id="email" label="Correo" error={this.state.errors.email} />

                <Text ref="Password" inputType="password" id="password" label="Contraseña" error={this.state.errors.password} />
                <Text ref="RepeatPassword" inputType="password" id="repeat_password" label="Confirmar Contraseña" error={this.state.errors.repeat_password} />

                <Select ref="Role" id="role" label="Permisos" error={this.state.errors.roles} options={availableRoles} />

                <SubmitCancelButton cancelClickHandler={this._clearAndHideForm} submitClickHandler={this._submit} label="Crear" />
            </form>
        );
    },

    _clearAndHideForm: function() {
        this.refs.FullName.clearValue();
        this.refs.Email.clearValue();
        this.refs.Password.clearValue();
        this.refs.RepeatPassword.clearValue();

        this.setState(getDefaultState);
        this.props.finishHandler();
    },

    _submit: function() {
        var form = {
            full_name: this.refs.FullName.getValue(),
            email: this.refs.Email.getValue(),
            password: this.refs.Password.getValue(),
            repeat_password: this.refs.RepeatPassword.getValue(),
            flat_roles: this.refs.Role.getValue()
        };

        if (!this._isValid(form)) {
            return;
        }

        UserActions.create(form);
        this._clearAndHideForm();
    },

    _isValid: function(form) {
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

        if (mapValidator.hasErrors) {
            var errors = this.state.errors;
            errors = assign({}, errors, mapValidator.errors);
            this.setState({errors: errors});

            return false;
        }

        return true;
    }
});