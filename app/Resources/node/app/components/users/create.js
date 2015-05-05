var React = require('react');
var Form = require('./common/form');
var Text = require('../core/form/text');
var CreateEditUtils = require('./common/create-edit-utils');
var Wrapper = require('../wrapper');

var Create = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return  CreateEditUtils.getCreateInitialState();
    },

    componentDidMount: function() {
        var getState = function() {
            return this.state;
        }.bind(this);

        var setState = function(state) {
            this.setState(state);
        }.bind(this);

        var router = this.context.router;

        CreateEditUtils.initialize('create', getState, setState, router);
    },

    render: function() {
        var fields = this.state.fields;

        return (
            <Wrapper title="Usuarios del Sistema - Crear Nuevo">
                <Form
                    fields={fields}
                    changeHandler={CreateEditUtils.changeHandler}
                    title="Nuevo Usuario"
                    submitLabel="Crear"
                    submitHandler={CreateEditUtils.submitHandler}>

                    <Text
                        inputType="password"
                        id="password"
                        label="Contraseña"
                        value={fields.password.value}
                        changeHandler={CreateEditUtils.changeHandler}
                        error={fields.password.error} />

                    <Text
                        inputType="password"
                        id="repeat_password"
                        label="Confirmar Contraseña"
                        value={fields.repeat_password.value}
                        changeHandler={CreateEditUtils.changeHandler}
                        error={fields.repeat_password.error} />
                </Form>
            </Wrapper>
        );
    },
});

module.exports = Create;