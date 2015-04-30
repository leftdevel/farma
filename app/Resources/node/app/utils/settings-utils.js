var _settings = document && JSON.parse(document.getElementById('app').getAttribute('data-settings'));
var UserUtils = require('./user-utils');
var _roles = UserUtils.getRoles();

module.exports = {
    getSettings: function() {
        return _settings;
    },

    isSuperAdmin: function() {
        return _settings.user.roles.indexOf(_roles.ROLE_SUPER_ADMIN) !== -1;
    },

    isAdmin: function() {
        return _settings.user.roles.indexOf(_roles.ROLE_ADMIN) !== -1;
    }
};