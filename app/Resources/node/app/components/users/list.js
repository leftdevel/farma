var React = require('react');
var UserActions = require('../../actions/user-actions');
var UserUtils = require('../../utils/user-utils');
var ModalActions = require('../../actions/modal-actions');
var UserStore = require('../../stores/user-store');
var SettingsUtils = require('../../utils/settings-utils');
var settings = SettingsUtils.getSettings();
var cx = require('class-set');

var CreateLink = require('../core/create-link');
var Wrapper = require('../wrapper');
var Navigation = require('react-router').Navigation;

function getState() {
    return {
        users: UserStore.getUsers()
    };
}

module.exports = React.createClass({
    mixins: [Navigation],

    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(getState());
    },

    render: function() {
        var records = this.state.users.map(function(user) {
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
            <Wrapper title="Usuarios del Sistema - Lista">
                <CreateLink title='Crear nuevo usuario' clickHandler={this._onCreateLinkClick} />
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
            </Wrapper>
        );
    },

    _onCreateLinkClick: function() {
        this.context.router.transitionTo('users-create');
    },

    _onEditClick: function(userId, event) {
        event.preventDefault();
        //UserActions.toggleEditView(userId)
    },

    // @TODO move to Store
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