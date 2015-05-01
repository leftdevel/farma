var React = require('react');

var MapValidator = require('../../lib/validator/map-validator');
var UserActions = require('../../actions/user-actions');
var Form = require('./common/form');
var ValidationSchema = require('./common/validation-schema');
var Text = require('../core/form/text');
var UserStore = require('../../stores/user-store');

var FormMixin = require('./common/form-mixin');

var Edit = React.createClass({
    mixins: [FormMixin],

    propTypes: {
        isUpdatePassword: React.PropTypes.bool.isRequired
    },

    render: function() {
        var fields = this.props.fields;

        return (
            <Form
                fields={fields}
                changeHandler={this.props.changeHandler}
                title="Actualizar Usuario"
                submitLabel="Actualizar"
                submitHandler={this.props.submitHandler}>

                {this._getPasswordToggler()}

                <div className={this.props.isUpdatePassword ? '' : 'hide'}>
                    <Text
                        inputType="password"
                        id="password"
                        label="Nueva Contraseña"
                        value={fields.password.value}
                        changeHandler={this.props.changeHandler}
                        error={fields.password.error} />

                    <Text
                        inputType="password"
                        id="repeat_password"
                        label="Confirmar Nueva Contraseña"
                        value={fields.repeat_password.value}
                        changeHandler={this.props.changeHandler}
                        error={fields.repeat_password.error} />
                </div>

            </Form>
        );
    },

    _getPasswordToggler: function() {
        return (
            <div className="row">
                <div className="col s12">
                    <a href="#" onClick={this._onPasswordTogglerClick}>
                        {this.props.isUpdatePassword ? 'No actualizar contraseña' : 'Acutualizar constraseña'}
                    </a>
                </div>
            </div>
        );
    },

    _onPasswordTogglerClick: function(event) {
        event.preventDefault();
        UserActions.toggleUpdatePassword();
    },

    getMapValidator: function() {
        var mapValidator = new MapValidator();
        var fields = this.props.fields;

        mapValidator
            .addValidatorForPath('full_name', ValidationSchema.getFullNameValidator(fields.full_name.value))
            .addValidatorForPath('email', ValidationSchema.getEditableEmailValidator(fields.email.value))
        ;

        if (this.props.isUpdatePassword) {
            mapValidator
                .addValidatorForPath('password', ValidationSchema.getPasswordValidator(fields.password.value))
                .addValidatorForPath('repeat_password',
                    ValidationSchema.getRepeatPasswordValidator(fields.repeat_password.value, fields.password.value))
            ;
        }

        return mapValidator;
    },
});

module.exports = Edit;