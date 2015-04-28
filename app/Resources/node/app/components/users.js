var React = require('react');
var UserStore = require('../stores/user-store.js');
var Wrapper = require('./wrapper');
var List = require('./users/list.js');
var CreateEdit = require('./users/create-edit.js');
var CreateLink = require('./users/create-link');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            users: UserStore.getAll(),
            view: 'list'
        };
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener();
    },

    _onChange: function() {
        this.setState({users: UserStore.getAll()});
    },

    render: function() {
        return (
            <Wrapper title="Usuarios del Sistema">
                <CreateLink isVisible={this.state.view === 'list'} clickHandler={this._switch.bind(null, 'create')} />
                <CreateEdit
                    isVisible={this.state.view === 'create' || this.state.view === 'edit'}
                    finishHandler={this._switch.bind(null, 'list')} />
                <List isVisible={this.state.view === 'list'} users={this.state.users} />
            </Wrapper>
        );
    },

    _switch: function(view) {
        this.setState({view: view});
    }
});