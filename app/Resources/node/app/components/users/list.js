var React = require('react');
var UserActions = require('../../actions/user-actions');
var UserUtils = require('../../utils/user-utils');
var ModalActions = require('../../actions/modal-actions');
var UserStore = require('../../stores/user-store');
var cx = require('class-set');

var CreateLink = require('../core/create-link');
var Wrapper = require('../wrapper');

function getState() {
    return {
        users: UserStore.getUsers()
    };
}

var List = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

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


        return (
            <Wrapper title="Usuarios del Sistema - Lista">
                <CreateLink title='Crear nuevo usuario' clickHandler={this._onCreateLinkClick} />
                {this._getTable()}
            </Wrapper>
        );
    },

    _getTable: function() {
        var records = this.state.users.map(function(user) {
            var canDeleteUser = UserStore.canDeleteUser(user.id);

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

    _onCreateLinkClick: function() {
        this.context.router.transitionTo('users-create');
    },

    _onEditClick: function(userId, event) {
        event.preventDefault();
        this.context.router.transitionTo('users-edit', {userId: userId});
    },

    // @TODO move to Store

    _onDeleteClick: function(userId, event) {
        event.preventDefault();

        if (!UserStore.canDeleteUser(userId)) return;

        var user = UserStore.findOneUserById(userId);

        var title = 'Eliminar Usuario';
        var content = 'Por favor confirme que desea eliminar a - ' + user.full_name.toUpperCase() + ' - del sistema. La información se borrará permanentemente.';
        var confirmCallback = function () {
            UserActions.deleteUser(userId);
        };

        ModalActions.open(title, content, confirmCallback);
    }
});

module.exports = List;