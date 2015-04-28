var React = require('react');
var UserStore = require('../stores/user-store.js');
var UserActions = require('../actions/user-actions');
var UserConstants = require('../constants/user-constants');

var Wrapper = require('./wrapper');
var List = require('./users/list.js');
var CreateEdit = require('./users/create-edit.js');
var CreateLink = require('./core/create-link');

function getState() {
    return {
        users: UserStore.getUsers(),
        view: UserStore.getView(),
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
        var isCreateEditVisible = this.state.view === 'create' || this.state.view === 'edit';
        var isListVisible = this.state.view === 'list';

        return (
            <Wrapper title="Usuarios del Sistema">
                <CreateLink
                    title='Crear nuevo usuarios'
                    isVisible={isCreateLinkVisible}
                    clickHandler={this._switch.bind(null, 'create')} />
                <CreateEdit
                    mode={this.state.view === 'edit' ? 'edit' : 'create'}
                    isVisible={isCreateEditVisible}
                    finishHandler={this._switch.bind(null, 'list')} />
                <List
                    isVisible={isListVisible}
                    users={this.state.users} />
            </Wrapper>
        );
    },

    _switch: function(view) {
        UserActions.changeView(view);
    }
});