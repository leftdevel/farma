var React = require('react');
var UserActions = require('../../actions/user-actions');
var UserUtils = require('../../utils/user-utils');
var ModalActions = require('../../actions/modal-actions');
var UserStore = require('../../stores/user-store');
var SettingsUtils = require('../../utils/settings-utils');
var settings = SettingsUtils.getSettings();
var cx = require('class-set');

module.exports = React.createClass({
    propTypes: {
        users: React.PropTypes.array.isRequired
    },

    render: function() {
        var records = this.props.users.map(function(user) {
            var canDeleteUser = this._canDeleteUser(user.id);

            var deleteButtonClassNames = cx({
                'waves-light waves-effect': true,
                'disabled': !canDeleteUser,
            });

            return (
                <tr key={user.id}>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{UserUtils.getLabelForRoles(user.roles)}</td>
                    <td>
                        <a
                            onClick={this._onEditClick.bind(null, user.id)}
                            className="waves-light waves-effect"
                        >Editar
                        </a>&nbsp;|&nbsp;<a
                            onClick={this._onDeleteClick.bind(null, user.id)}
                            className={deleteButtonClassNames}
                        >Eliminar</a>
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

    _canDeleteUser: function(userId) {
        return settings.user.id != userId;
    },

    _onDeleteClick: function(userId, event) {
        event.preventDefault();

        if (!this._canDeleteUser(userId)) return;

        var user = UserStore.findOneUserById(userId);

        var title = 'Eliminar Usuario';
        var content = 'Por favor confirme que desea eliminar a - ' + user.full_name.toUpperCase() + ' - del sistema. La información se borrará permanentemente.';
        var confirmCallback = function () {
            UserActions.deleteUser(userId);
        };

        ModalActions.open(title, content, confirmCallback);
    }
});