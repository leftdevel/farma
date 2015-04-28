var React = require('react');

var UserActions = require('../../actions/user-actions');

// FORM
var CommonForm = require('./common/form');
var Text = require('../core/form/text');

// UTILS
var Common = require('./common/common');

module.exports = React.createClass({
    getInitialState: function() {
        return Common.getDefaultState();
    },

    render: function() {
        var fields = this.state.fields;

        return (
            <CommonForm
                fields={fields}
                changeHandler={this._changeHandler}
                title="Nuevo Usuario"
                submitLabel="Crear"
                cancelHandler={this._onCancel}
                submitHandler={this._onSubmit}>

                <Text
                    ref="Password"
                    inputType="password"
                    id="password"
                    label="Contraseña"
                    value={fields.password.value}
                    changeHandler={this._changeHandler}
                    error={fields.password.error} />

                <Text
                    ref="RepeatPassword"
                    inputType="password"
                    id="repeat_password"
                    label="Confirmar Contraseña"
                    value={fields.repeat_password.value}
                    changeHandler={this._changeHandler}
                    error={fields.repeat_password.error} />
            </CommonForm>
        );
    },

    _changeHandler: function(property, value) {
        var state = this.state;
        state.fields[property].value = value;
        this.setState(state);
    },

    _onSubmit: function() {

    }
});