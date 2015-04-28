var AppDispatcher = require('../dispatcher/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/user-constants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var allowedViews = ['list', 'create', 'edit'];

var _data = {
    users: [],
    view: allowedViews[0],
};

function setUsers(users) {
    _data.users = users;
}

function changeView(view) {
    if (allowedViews.indexOf(view) === -1) {
        alert('Invliad view');
        throw "Invalid view";
    }

    _data.view = view;
}

var UserStore = assign({}, EventEmitter.prototype, {
    getUsers: function() {
        return _data.users;
    },

    findOne: function(id) {
        var users = _data.users;

        for (var i in users) {
            var user = users[i];

            if (user.id === id) {
                return user;
            }
        }

        return null;
    },

    getView: function() {
        return _data.view;
    },

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
        case UserConstants.USERS_RECEIVE_ALL:
            setUsers(action.users);
            UserStore.emitChange();

          break;

        case UserConstants.USERS_UI_CHANGE_VIEW:
            changeView(action.view);
            UserStore.emitChange();
          break;

        default:
        // no op
    }
});

module.exports = UserStore;