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
        isUpdatePassword: UserStore.isUpdatePassword(),
    };
}

module.exports = React.createClass({
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
        var isCreateLinkVisible = this.state.view === 'list';
        var isCreateVisible = this.state.view === 'create';
        var isEditVisible = this.state.view === 'edit';
        var isListVisible = this.state.view === 'list';

        return (
            <Wrapper title="Usuarios del Sistema">

                <div className={isCreateLinkVisible ? '' : 'hide'}>
                    <CreateLink title='Crear nuevo usuarios' clickHandler={UserActions.toggleCreateView} />
                </div>
                <div className={isCreateVisible ? '' : 'hide'}>
                    <Create fields={this.state.createFields} />
                </div>
                <div className={isEditVisible ? '' : 'hide'}>
                    <Edit fields={this.state.editFields} isUpdatePassword={this.state.isUpdatePassword} />
                </div>
                <div className={isListVisible ? '' : 'hide'}>
                    <List users={this.state.users} />
                </div>

            </Wrapper>
        );
    }
});