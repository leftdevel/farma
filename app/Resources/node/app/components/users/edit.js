var React = require('react');
var Form = require('./common/form');
var Text = require('../core/form/text');
var UserStore = require('../../stores/user-store');
var CreateEditUtils = require('./common/create-edit-utils');
var Wrapper = require('../wrapper');

// Component

var Edit = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        var userId = this.context.router.getCurrentParams().userId;
        return CreateEditUtils.getEditInitialState(userId);
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);

        var getState = function() {
            return this.state;
        }.bind(this);

        var setState = function(state) {
            this.setState(state);
        }.bind(this);

        var router = this.context.router;

        CreateEditUtils.initialize('edit', getState, setState, router);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        var userId = this.context.router.getCurrentParams().userId;
        var state = CreateEditUtils.getEditInitialState(userId);
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
                    changeHandler={CreateEditUtils.changeHandler}
                    title="Actualizar Usuario"
                    submitLabel="Actualizar"
                    submitHandler={CreateEditUtils.submitHandler}>

                    {this._getPasswordToggler()}

                    <div className={this.state.isUpdatePassword ? '' : 'hide'}>
                        <Text
                            inputType="password"
                            id="password"
                            label="Nueva Contraseña"
                            value={fields.password.value}
                            changeHandler={CreateEditUtils.changeHandler}
                            error={fields.password.error} />

                        <Text
                            inputType="password"
                            id="repeat_password"
                            label="Confirmar Nueva Contraseña"
                            value={fields.repeat_password.value}
                            changeHandler={CreateEditUtils.changeHandler}
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
    }
});

module.exports = Edit;