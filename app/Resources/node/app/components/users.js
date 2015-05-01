var React = require('react');
var UserStore = require('../stores/user-store.js');
var UserActions = require('../actions/user-actions');

var Wrapper = require('./wrapper');
var List = require('./users/list.js');
var Create = require('./users/create.js');
var Edit = require('./users/edit.js');
var CreateLink = require('./core/create-link');

function getState() {
    return {
        users: UserStore.getUsers(),
        view: UserStore.getView(),
        createFields: UserStore.getCreateFields(),
        editFields: UserStore.getEditFields(),
        isUpdatePassword: UserStore.isUpdatePassword()
    };
}

var Users = React.createClass({
    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener();
    },

    _onChange: function() {
        this.setState(getState());
    },

    render: function() {
        var currentComponent;

        if (this.state.view === 'list') {
            currentComponent = (
                <div>
                    <CreateLink title='Crear nuevo usuario' clickHandler={UserActions.toggleCreateView} />
                    <List users={this.state.users} />
                </div>
            );
        } else if (this.state.view === 'create') {
            currentComponent = (
                <Create
                    ref="Create"
                    fields={this.state.createFields}
                    changeHandler={this._formChangeHandler}
                    submitHandler={this._formSubmitHandler.bind(null, 'create')}/>
            );
        } else if (this.state.view === 'edit') {
            currentComponent = (
                <Edit
                    ref="Edit"
                    fields={this.state.editFields}
                    isUpdatePassword={this.state.isUpdatePassword}
                    changeHandler={this._formChangeHandler}
                    submitHandler={this._formSubmitHandler.bind(null, 'edit')}/>
            );
        }

        return (
            <Wrapper title="Usuarios del Sistema">
                {currentComponent}
            </Wrapper>
        );
    },

    _formChangeHandler: function(propertyPath, value) {
        UserActions.updateFormValue(propertyPath, value);
    },

    _formSubmitHandler: function(action) {
        var actions = ['edit', 'create'];
        if (actions.indexOf(action) === -1) {
            var errorMessage = 'invalid action ' + action;
            alert(errorMessage);
            throw errorMessage;
        }

        var mapValidator = action === 'create' ? this.refs.Create.getMapValidator() : this.refs.Edit.getMapValidator();
        mapValidator.validateAll();

        if (mapValidator.hasErrors) {
            UserActions.setFormErrors(mapValidator.errors);
            return;
        }

        var entity = UserStore.getFormEntity();

        if (action === 'create') {
            UserActions.createUser(entity);
        } else {
            UserActions.updateUser(entity);
        }
    },
});

module.exports = Users;