var React = require('react');
var UserActions = require('../../actions/user-actions');
var UserUtils = require('../../utils/user-utils');
var ModalActions = require('../../actions/modal-actions');
var rolesMap = UserUtils.getRolesMap();
var UserStore = require('../../stores/user-store');

module.exports = React.createClass({
    propTypes: {
        users: React.PropTypes.array.isRequired
    },

    render: function() {
        var records = this.props.users.map(function(user) {
            return (
                <tr key={user.id}>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{UserUtils.getLabelForRoles(user.roles)}</td>
                    <td>
                        <a
                            onClick={this._onEditClick.bind(null, user.id)}
                            className="waves-effect waves-light"
                        >
                            <i className="mdi-editor-mode-edit right"></i>
                            Editar
                        </a>
                        &nbsp;&nbsp;|&nbsp;&nbsp;
                        <a
                            onClick={this._onDeleteClick.bind(null, user.id)}
                            className="waves-effect waves-light"
                        >
                            <i className="mdi-content-clear right"></i>
                            Eliminar
                        </a>
                    </td>
                </tr>
            );
        }.bind(this));

        return (
            <table className="hoverable">
                <thead>
                    <tr>
                        <th data-field="id">Nombre</th>
                        <th data-field="email">Correo</th>
                        <th data-field="roles">Departamento</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {records}
                </tbody>
            </table>
        );
    },

    _onEditClick: function(userId, event) {
        event.preventDefault();
        UserActions.toggleEditView(userId)
    },

    _onDeleteClick: function(userId, event) {
        event.preventDefault();
        var user = UserStore.findOneUserById(userId);

        var title = 'Eliminar Usuario';
        var content = 'Por favor confirme que desea eliminar a - ' + user.full_name.toUpperCase() + ' - del sistema. La información no podrá ser recuperada.';
        var confirmCallback = function () {
            UserActions.deleteUser(userId);
        };

        ModalActions.open(title, content, confirmCallback);
    }
});