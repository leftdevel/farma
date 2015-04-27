var React = require('react');

module.exports = React.createClass({
    render: function() {
        var records = this.props.users.map(function(user) {
            return (
                <tr key={user.id}>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{user.flat_roles}</td>
                    <td>
                        <a
                            onClick={this._enterEditMode.bind(null, user.id)}
                            className="waves-effect waves-light"
                        >
                            <i className="mdi-editor-mode-edit right"></i>
                            Editar
                        </a>
                    </td>
                </tr>
            );
        }.bind(this));

        return (
            <table className="hoverable responsive-table">
                <thead>
                    <tr>
                        <th data-field="id">Nombre</th>
                        <th data-field="email">Correo</th>
                        <th data-field="roles">Permisos</th>
                    </tr>
                </thead>
                <tbody>
                    {records}
                </tbody>
            </table>
        );
    },

    _enterEditMode: function(id) {
        console.log('Entering edit mode for ' + id);
    }
});