var React = require('react');
var cx = require('class-set');
var assign = require('object-assign');

var Text = require('../core/form/text');
var SubmitCancelButton = require('../core/form/submit-cancel-button');

var Validator = require('../../lib/validator/validator');
var MapValidator = require('../../lib/validator/map-validator');
var Constraints = require('../../lib/validator/constraints/core');

var roles = [
    {value: 'ROLE_SUPER_ADMIN', label: 'dueño'},
    {value: 'ROLE_ADMIN', label: 'administrador'},
    {value: 'ROLE_SALES', label: 'vendedor'},
    {value: 'ROLE_GROCER', label: 'bodeguero'}
];

function getDefaultState() {
    return {
        isFormVisible: false,
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
    getInitialState: function() {
        return getDefaultState();
    },

    render: function() {
        var createUserLinkClassNames = cx({
            'float': true,
            'right': true,
            'hide': this.state.isFormVisible
        });

        var formClassNames = cx({
            'col': true,
            's12': true,
            'hide': !this.state.isFormVisible
        });

        return (
            <div>
                <div className={createUserLinkClassNames}>
                    <a href="#" onClick={this._showForm} className="waves-effect waves-light">Crear Nuevo Usuario</a>&nbsp;
                    <a href="#" onClick={this._showForm} className="btn-floating btn-large waves-effect waves-light red">
                        <i className="mdi-content-add"></i>
                    </a>
                </div>
                <form className={formClassNames}>
                    <h5>Nuevo Usuario</h5>
                    <Text ref="FullName" id="full_name" label="Nombre" error={this.state.errors.full_name} />
                    <Text ref="Email" id="email" label="Correo" error={this.state.errors.email} />

                    <Text ref="Password" inputType="password" id="password" label="Contraseña" error={this.state.errors.password} />
                    <Text ref="RepeatPassword" inputType="password" id="repeat_password" label="Confirmar Contraseña" error={this.state.errors.repeat_password} />

                    <SubmitCancelButton cancelClickHandler={this._clearAndHideForm} submitClickHandler={this._submit} label="Crear" />
                </form>
            </div>
        );
    },

    _showForm: function(event) {
        event.preventDefault();
        this.setState({isFormVisible: true});
    },

    _clearAndHideForm: function(event) {
        event && event.preventDefault();

        this.refs.FullName.clearValue();
        this.refs.Email.clearValue();
        this.refs.Password.clearValue();
        this.refs.RepeatPassword.clearValue();

        this.setState(getDefaultState);
    },

    _submit: function(event) {
        event.preventDefault();

        var form = {
            full_name: this.refs.FullName.getValue(),
            email: this.refs.Email.getValue(),
            password: this.refs.Password.getValue(),
            repeat_password: this.refs.RepeatPassword.getValue()
        };

        if (!this._isValid(form)) {

            return;
        }

        this._clearAndHideForm();

        // TODO show success message
        // Action create new user
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