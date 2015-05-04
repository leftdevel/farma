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

var Edit = React.createClass({
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
            },

            isUpdatePassword: false
        };
    },

    componentDidMount: function() {
        // var userId = this.props.params.userId;
        console.log(this.context.router.getCurrentParams());

        // @ TODO prefill form with current user data.
        // @ TODO listen to users store changes, on first run we won't have a list of users straight away.
    },

    render: function() {
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

                    <div className={this._isUpdatePassword ? '' : 'hide'}>
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
        this.transitionTo('/users');
    },

    _getMapValidator: function() {
        var mapValidator = new MapValidator();
        var fields = this.state.fields;

        mapValidator
            .addValidatorForPath('full_name', ValidationSchema.getFullNameValidator(fields.full_name.value))
            .addValidatorForPath('email', ValidationSchema.getEditableEmailValidator(fields.email.value))
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

        entity.full_name = fields.full_name.value;
        entity.email = fields.email.value;
        entity.roles = [fields.role.value]; // Backend API expects array
        entity.password = fields.password.value;

        entity.id = this.props.params.userId;

        return entity;
    }
});

module.exports = Edit;