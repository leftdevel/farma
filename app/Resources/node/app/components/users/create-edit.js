var React = require('react');
var cx = require('class-set');
var Commands = require('./create-edit/commands');

var Text = require('../form/text');
var Select = require('../form/select');
var SubmitCancelButton = require('../form/submit-cancel-button');

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

                <SubmitCancelButton cancelClickHandler={this._onCancelClick} submitClickHandler={this._onSubmitClick} label="Crear" />
            </form>
        );
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