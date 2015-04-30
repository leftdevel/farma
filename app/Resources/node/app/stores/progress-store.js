

// @TODO Should also listen to global error store and reset _queue;

var AppDispatcher = require('../dispatcher/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var UserConstants = require('../constants/user-constants');

var CHANGE_EVENT = 'change';

var _isWorking = false;
var _queue = 0;

var _increasers = [
    // USERS
    UserConstants.USERS_FETCH_ALL,
    UserConstants.USERS_CREATE,
    UserConstants.USERS_UPDATE,
];

var _reducers = [
    // USERS
    UserConstants.USERS_SET_ALL,
    UserConstants.USERS_CREATE_SUCCESS,
    UserConstants.USERS_UPDATE_SUCCESS,
];

function increaseQueue() {
    _queue++;
    _isWorking = true;
}

function reduceQueue() {
    if (_queue > 0) {
        _queue--;
    }

    if (_queue === 0) {
        _isWorking = false;
    }
}

var ProgressStore = assign({}, EventEmitter.prototype, {
    isWorking: function() {
        return _isWorking;
    },

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
    if (action.isBackground) {
        return;
    }

    if (_increasers.indexOf(action.actionType) !== -1) {
        increaseQueue();
        ProgressStore.emitChange();

    } else if (_reducers.indexOf(action.actionType) !== -1) {
        reduceQueue();
        ProgressStore.emitChange();
    }
});

module.exports = ProgressStore;