var React = require('react');
var UserStore = require('../stores/user-store.js');
var Table = require('./users/table.js');

function getState() {
    return {
        users: UserStore.getAll()
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
        return (
            <div>
                <h2>Usuarios del Sistema</h2>
                <Table users={this.state.users} />
            </div>
        );
    }
});