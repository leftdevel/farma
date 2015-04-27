var React = require('react');

module.exports = React.createClass({
    render: function() {
        var records = this.props.users.map(function(user) {
            return (
                <tr key={user.id}>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{user.roles}</td>
                </tr>
            );
        });

        return (
            <table className="hoverable responsive-table">
                <thead>
                    <tr>
                        <th data-field="id">Nombre</th>
                        <th data-field="email">Correo Electrónico</th>
                        <th data-field="roles">Permisos</th>
                    </tr>
                </thead>
                <tbody>
                    {records}
                </tbody>
            </table>
        );
    }
});