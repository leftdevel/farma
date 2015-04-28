var React = require('react');
var UserStore = require('../stores/user-store.js');
var UserActions = require('../actions/user-actions');

var Wrapper = require('./wrapper');
var List = require('./users/list.js');
var Create = require('./users/create.js');
var CreateLink = require('./core/create-link');

function getState() {
    return {
        users: UserStore.getUsers(),
        view: UserStore.getView(),
        createFields: UserStore.getCreateFields(),
        editFields: UserStore.getEditFields(),
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
        var isCreateVisible = this.state.view === 'create' || this.state.view === 'edit';
        var isListVisible = this.state.view === 'list';

        return (
            <Wrapper title="Usuarios del Sistema">

                <div className={isCreateLinkVisible ? '' : 'hide'}>
                    <CreateLink title='Crear nuevo usuarios' clickHandler={this._switch.bind(null, 'create')} />
                </div>
                <div className={isCreateVisible ? '' : 'hide'}>
                    <Create fields={this.state.createFields} mode={this.state.view === 'edit' ? 'edit' : 'create'} />
                </div>
                <div className={isListVisible ? '' : 'hide'}>
                    <List users={this.state.users} />
                </div>

            </Wrapper>
        );
    },

    _switch: function(view) {
        UserActions.changeView(view);
    }
});