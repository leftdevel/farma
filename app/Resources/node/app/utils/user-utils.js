var keyMirror = require('keymirror');

var _roles = keyMirror({
    ROLE_SUPER_ADMIN: null,
    ROLE_ADMIN: null,
    ROLE_SALES: null,
    ROLE_INVENTORY: null,
});

var roleValues =

module.exports = {
    getRoles: function() {
        return _roles;
    },

    getRolesMap: function() {
        return [
            {value: _roles.ROLE_SUPER_ADMIN, label: 'dueño'},
            {value: _roles.ROLE_ADMIN, label: 'administrador'},
            {value: _roles.ROLE_SALES, label: 'vendedor'},
            {value: _roles.ROLE_INVENTORY, label: 'bodeguero'}
        ];
    },

    getRoleFormOptions: function() {
        return this.getRolesMap().filter(function(role) {
            return role.value !== _roles.ROLE_SUPER_ADMIN;
        });
    },

    getLabelForRoles: function(roles) {
        var labels = [];

        for (var i in roles) {
            var role = roles[i];
            var label = this.getLabelForRole(role);

            if (!label) {
                var errorMessage = 'Invalid role ' + role;
                alert(errorMessage);
                throw errorMessage;
            }

            labels.push(label);
        }

        return labels.join(', ');
    },

    getLabelForRole: function(role) {
        var map = this.getRolesMap();
        for (var i in map) {
            var roleInLoop = map[i];

            if (roleInLoop.value == role) {
                return roleInLoop.label;
            }
        }
    }
};