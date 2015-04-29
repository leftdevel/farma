var React = require('react');
var cx = require('class-set');
var Commands = require('./create-edit/commands');

var Text = require('../core/form/text');
var Select = require('../core/form/select');
var SubmitCancelButton = require('../core/form/submit-cancel-button');

var UserUtils = require('../../utils/user-utils');
var availableRoles = UserUtils.roles.filter(function(role) {
    return role.value !== 'ROLE_SUPER_ADMIN';
});

function getDefaultState() {
    return {
        showPasswordsInEditMode: false,
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
        isVisible: React.PropTypes.bool.isRequired,
        mode: React.PropTypes.oneOf(['create', 'edit']).isRequired
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
                <Select ref="Role" id="role" label="Permisos" error={this.state.errors.roles} options={availableRoles} />
                {this._getPasswordsForCurrentMode()}
                <SubmitCancelButton cancelClickHandler={this._onCancelClick} submitClickHandler={this._onSubmitClick} label="Crear" />
            </form>
        );
    },

    _getPasswordsForCurrentMode: function() {
        var passwordToggler = '';
        if (this.props.mode === 'edit') {

            passwordToggler = (
                <a href="#" onClick={this._toggleShowPasswordsInEditMode}>
                    {this.state.showPasswordsInEditMode ? 'No actualizar contraseña' : 'Acutualizar constraseña'}
                </a>
            );
        }

        var passwordLabel = this.props.mode === 'create' ? 'Contraseña' : 'Nueva Contraseña';
        var repeatPasswordLabel = this.props.mode === 'create' ? 'Confirmar contraseña' : 'Confirmar nueva ontraseña';

        var wrapperClassNames = cx({
            'hide': this.props.mode === 'edit' && !this.state.showPasswordsInEditMode
        });

        return (
            <div>
                <div className="row">
                    <div className="col s12">
                        {passwordToggler}
                    </div>
                </div>
                <div className={wrapperClassNames}>
                    <Text
                        ref="Password"
                        inputType="password"
                        id="password"
                        label={passwordLabel}
                        error={this.state.errors.password} />
                    <Text
                        ref="RepeatPassword"
                        inputType="password"
                        id="repeat_password"
                        label={repeatPasswordLabel}
                        error={this.state.errors.repeat_password} />
                </div>
            </div>
        );
    },

    _toggleShowPasswordsInEditMode: function(event) {
        event.preventDefault();
        this.setState({showPasswordsInEditMode: !this.state.showPasswordsInEditMode});
    },

    _onCancelClick: function() {
        Commands.clearAndFinish(this);
    },

    _onSubmitClick: function() {
        Commands.submit(this);
    },

    setDefaultState: function() {
        this.setState(getDefaultState());
    }
});