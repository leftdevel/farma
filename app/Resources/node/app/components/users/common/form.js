var React = require('react');

var Text = require('../../core/form/text');
var Select = require('../../core/form/select');
var SubmitCancelButton = require('../../core/form/submit-cancel-button');

var UserUtils = require('../../../utils/user-utils');
var _roles = UserUtils.getRoles();
var UserActions = require('../../../actions/user-actions');
var FormMixin = require('./form-mixin');

var Form = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    mixins: [FormMixin],

    propTypes: {
        title: React.PropTypes.string.isRequired,
        submitLabel: React.PropTypes.string.isRequired
    },

    render: function() {

        var fields = this.props.fields;

        return (
            <form className="col s12">
                <h5>{this.props.title}</h5>
                <Text
                    id="full_name"
                    label="Nombre"
                    value={fields.full_name.value}
                    changeHandler={this.props.changeHandler}
                    error={fields.full_name.error} />

                <Text
                    id="email"
                    label="Correo"
                    value={fields.email.value}
                    changeHandler={this.props.changeHandler}
                    error={fields.email.error} />

                <Select
                    id="role"
                    value={fields.role.value}
                    label={this._getSelectRoleLabel()}
                    disabled={this._isSelectRoleDisabled()}
                    options={this._getSelectRoleOptions()}
                    changeHandler={this.props.changeHandler}
                    error={fields.role.error} />

                {this.props.children}

                <SubmitCancelButton
                    label={this.props.submitLabel}
                    cancelHandler={this._onCancel}
                    submitHandler={this.props.submitHandler} />
            </form>
        );
    },

    _isSuperAdmin: function() {
        return this.props.fields.role.value === _roles.ROLE_SUPER_ADMIN;
    },

    _getSelectRoleLabel: function() {
        return this._isSuperAdmin() ? 'Departamento \u00b7 NO MODIFICABLE PARA ESTE USUARIO' : 'Departamento';
    },

    _isSelectRoleDisabled: function() {
        return this._isSuperAdmin();
    },

    _getSelectRoleOptions: function() {
        return this._isSuperAdmin() ? UserUtils.getRoleFormOptionsForSuperAdmin() : UserUtils.getRoleFormOptions();
    },

    _onCancel: function() {
        this.context.router.transitionTo('users');
    }
});

module.exports = Form;