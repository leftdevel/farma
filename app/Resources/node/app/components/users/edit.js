var React = require('react');
var assign = require('object-assign');

// Components
var Form = require('./common/form');
var Text = require('../core/form/text');
var Wrapper = require('../wrapper');

// Utils
var UserStore = require('../../stores/user-store');
var BaseCreateEdit = require('./common/base-create-edit');
var UserActions = require('../../actions/user-actions');

// Validation
var MapValidator = require('../../lib/validator/map-validator');
var ValidationSchema = require('./common/validation-schema');


var Edit = React.createClass(assign({}, BaseCreateEdit.prototype, {
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        var userId = this.context.router.getCurrentParams().userId;

        var state = {
            user: null,
            isUpdatePassword: false,
            hasStoreBooted: UserStore.hasBooted(),
            fields: this.getDefaultFields()
        };

        var user = UserStore.findOneUserById(userId);

        if (user) {
            state.user = user;
            this.bindUserToFields(user, state.fields);
        }

        return state;
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        var state = this.getInitialState();
        state.hasStoreBooted = true;
        this.setState(state);
    },

    render: function() {
        // For when the url is hit directly or for a page refresh
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
                    changeHandler={this.changeHandler}
                    title="Actualizar Usuario"
                    submitLabel="Actualizar"
                    submitHandler={this.submitHandler}>

                    {this._getPasswordToggler()}

                    <div className={this.state.isUpdatePassword ? '' : 'hide'}>
                        <Text
                            inputType="password"
                            id="password"
                            label="Nueva Contraseña"
                            value={fields.password.value}
                            changeHandler={this.changeHandler}
                            error={fields.password.error} />

                        <Text
                            inputType="password"
                            id="repeat_password"
                            label="Confirmar Nueva Contraseña"
                            value={fields.repeat_password.value}
                            changeHandler={this.changeHandler}
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

    _sendUserAction: function() {
        var entity = this._getFormEntity();
        UserActions.updateUser(entity);
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
}));

module.exports = Edit;