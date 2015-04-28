module.exports = {
    roles: [
        {value: 'ROLE_SUPER_ADMIN', label: 'dueño'},
        {value: 'ROLE_ADMIN', label: 'administrador'},
        {value: 'ROLE_SALES', label: 'vendedor'},
        {value: 'ROLE_INVENTORY', label: 'bodeguero'}
    ],

    getRoleFormOptions: function() {
        return this.roles.filter(function(role) {
            return role.value !== 'ROLE_SUPER_ADMIN';
        });
    }
};