var React = require('react');

var UserUtils = require('../../../utils/user-utils');
var Text = require('../../core/form/text');
var Select = require('../../core/form/select');
var SubmitCancelButton = require('../../core/form/submit-cancel-button');

UserActions = require('../../../actions/user-actions');

module.exports = React.createClass({
    propTypes: {
        fields: React.PropTypes.object.isRequired,
        title: React.PropTypes.string.isRequired,
        changeHandler: React.PropTypes.func.isRequired,
        submitLabel: React.PropTypes.string.isRequired,
        submitHandler: React.PropTypes.func.isRequired
    },

    render: function() {

        var fields = this.props.fields;

        return (
            <form className="col s12">
                <h5>{this.props.title}</h5>
                <Text
                    ref="FullName"
                    id="full_name"
                    label="Nombre"
                    value={fields.full_name.value}
                    changeHandler={this.props.changeHandler}
                    error={fields.full_name.error} />

                <Text
                    ref="Email"
                    id="email"
                    label="Correo"
                    value={fields.email.value}
                    changeHandler={this.props.changeHandler}
                    error={fields.email.error} />

                <Select
                    ref="Role"
                    id="role"
                    label="Permisos"
                    value={fields.role.value}
                    changeHandler={this.props.changeHandler}
                    error={fields.role.error}
                    options={UserUtils.getRoleFormOptions()} />

                {this.props.children}

                <SubmitCancelButton
                    label={this.props.submitLabel}
                    cancelHandler={this.props._onCancel}
                    submitHandler={this.props.submitHandler} />
            </form>
        );
    },

    _onCancel: function() {
        this.setState(Common.getDefaultState());
        UserActions.changeView('list');
    },
});