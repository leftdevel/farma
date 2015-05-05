var React = require('react');

var MapValidator = require('../../lib/validator/map-validator');
var UserActions = require('../../actions/user-actions');
var Form = require('./common/form');
var ValidationSchema = require('./common/validation-schema');
var Text = require('../core/form/text');
var UserStore = require('../../stores/user-store');

var FormMixin = require('./common/form-mixin');
var Wrapper = require('../wrapper');
var _roles = require('../../utils/user-utils').getRoles();
var ModalActions = require('../../actions/modal-actions');


function getDefaultState() {
    return  {
        user: null,
        isUpdatePassword: false,
        hasStoreBooted: UserStore.hasBooted(),
        fields: {
            full_name: {value: '', error: ''},
            email: {value: '', error: ''},
            role: {value: _roles.ROLE_ADMIN, error: ''}, // One role at a time for current version.
            password: {value: '', error: ''},
            repeat_password: {value: '', error: ''}
        }
    };
}

function getStateForUserId(userId) {
    var user = UserStore.findOneUserById(userId);
    var state = getDefaultState();

    if (!user) {
        state.user = null;
        return state;
    }

    state.user = user;

    var fields = state.fields;
    fields.full_name.value = user.full_name;
    fields.email.value = user.email;
    // Roles are fetched as array but we only support
    // one role at a time in current frontend version
    // for the form specifically.
    fields.role.value = user.roles[0];

    return state;
}

// Component

var Edit = React.createClass({
    mixins: [FormMixin],

    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        var userId = this.context.router.getCurrentParams().userId;
        return getStateForUserId(userId);
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        var userId = this.context.router.getCurrentParams().userId;
        var state = getStateForUserId(userId);
        state.hasStoreBooted = true;
        this.setState(state);
    },

    render: function() {
        // For when the url is hit directly or by a page refresh
        if (!this.state.hasStoreBooted) {
            return (
                <Wrapper title="Usuarios del Sistema - Editar" />
            );
        }

        if (!this.state.user) {
            this.context.router.transitionTo('users');
            return null;
        }

        var fields = this.state.fields;

        return (
            <Wrapper title="Usuarios del Sistema - Editar">
                <Form
                    fields={fields}
                    changeHandler={this._changeHandler}
                    title="Actualizar Usuario"
                    submitLabel="Actualizar"
                    submitHandler={this._submitHandler}>

                    {this._getPasswordToggler()}

                    <div className={this.state.isUpdatePassword ? '' : 'hide'}>
                        <Text
                            inputType="password"
                            id="password"
                            label="Nueva Contraseña"
                            value={fields.password.value}
                            changeHandler={this._changeHandler}
                            error={fields.password.error} />

                        <Text
                            inputType="password"
                            id="repeat_password"
                            label="Confirmar Nueva Contraseña"
                            value={fields.repeat_password.value}
                            changeHandler={this._changeHandler}
                            error={fields.repeat_password.error} />
                    </div>

                </Form>
            </Wrapper>
        );
    },

    _getPasswordToggler: function() {
        return (
            <div className="row">
                <div className="col s12">
                    <a href="#" onClick={this._onPasswordTogglerClick}>
                        {this.state.isUpdatePassword ? 'No cambiar contraseña' : 'Cambiar constraseña'}
                    </a>
                </div>
            </div>
        );
    },

    _onPasswordTogglerClick: function(event) {
        event.preventDefault();
        this.setState({isUpdatePassword: !this.state.isUpdatePassword});
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

        UserActions.updateUser(entity);
        this.context.router.transitionTo('users');
    },

    _getMapValidator: function() {
        var mapValidator = new MapValidator();
        var fields = this.state.fields;
        var userId = this.state.user.id;

        mapValidator
            .addValidatorForPath('full_name', ValidationSchema.getFullNameValidator(fields.full_name.value))
            .addValidatorForPath('email', ValidationSchema.getEditableEmailValidator(fields.email.value, userId))
        ;

        if (this.state.isUpdatePassword) {
            mapValidator
                .addValidatorForPath('password', ValidationSchema.getPasswordValidator(fields.password.value))
                .addValidatorForPath('repeat_password',
                    ValidationSchema.getRepeatPasswordValidator(fields.repeat_password.value, fields.password.value))
            ;
        }

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

        entity.id = this.state.user.id;
        entity.full_name = fields.full_name.value;
        entity.email = fields.email.value;
        entity.roles = [fields.role.value]; // Backend API expects array

        if (this.state.isUpdatePassword) {
            entity.password = fields.password.value;
        }

        return entity;
    }
});

module.exports = Edit;