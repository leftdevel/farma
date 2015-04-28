var React = require('react');
var UserUtils = require('../../utils/user-utils');
var cx = require('class-set');

var roles = UserUtils.roles;

function getRoleLabel(value) {
    for (var i in roles) {
        var role = roles[i];

        if (role.value === value) {
            return role.label;
        }
    }
}

module.exports = React.createClass({
    propTypes: {
        isVisible: React.PropTypes.bool.isRequired
    },

    render: function() {
        var records = this.props.users.map(function(user) {
            return (
                <tr key={user.id}>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{getRoleLabel(user.flat_roles)}</td>
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

        var classNames = cx({
            'hoverable': true,
            'hide': !this.props.isVisible
        });

        return (
            <table className={classNames}>
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