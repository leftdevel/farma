var assign = require('object-assign');
var AppDispatcher = require('../dispatcher/app-dispatcher');
var EventEmitter = require('events').EventEmitter;

var SettingsUtil = require('../utils/settings-utils');
var UserConstants = require('../constants/user-constants');
var _roles = require('../utils/user-utils').getRoles();

var CHANGE_EVENT = 'change';
var _has_booted = false;

var _data = {
    users: []
};

function setUsers(users) {
    if (SettingsUtil.isSuperAdmin()) {
        _data.users = users;
    } else {
        _data.users = users.filter(function(user) {
            return user.roles.indexOf(_roles.ROLE_SUPER_ADMIN) === -1;
        });
    }
}

var UserStore = assign({}, EventEmitter.prototype, {
    getUsers: function() {
        return _data.users;
    },

    findOneUserById: function(userId) {
        var users = _data.users;

        for (var i in users) {
            var user = users[i];

            if (user.id == userId) {
                return user;
            }
        }

        return null;
    },

    canDeleteUser: function(userId) {
        return SettingsUtil.getSettings().user.id != userId;
    },

    hasBooted: function() {
        return _has_booted;
    },

    // EventEMitter

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
});

AppDispatcher.register(function(action) {
    var text;

    switch(action.actionType) {
        case UserConstants.USERS_SET_ALL:
            setUsers(action.users);
            _has_booted = true; // initialization
            UserStore.emitChange();
            break;

        default:
        // no op
    }
});

module.exports = UserStore;