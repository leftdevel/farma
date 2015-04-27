var React = require('react');

var Table = require('./users/table.js');

module.exports = React.createClass({
    getInitialState: function() {
        return {users: [
            {id: 1, full_name: 'Ricardo Lopez', email: 'richard@gmail.com', roles: 'admin'},
            {id: 2, full_name: 'Oscar Balladares', email: 'matachivos@gmail.com', roles: 'admin'}
        ]};
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