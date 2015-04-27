var AppDispatcher = require('../dispatcher/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/user-constants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _users = [];

var UserStore = assign({}, EventEmitter.prototype, {
    getAll: function() {
        return _users;
    },

    // LIST
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

AppDispatcher.register(function(action) {
    var text;

    switch(action.actionType) {
        case UserConstants.USERS_RECEIVE_ALL:
            _users = action.users;
            UserStore.emitChange();

          break;

        default:
        // no op
    }
});

module.exports = UserStore;