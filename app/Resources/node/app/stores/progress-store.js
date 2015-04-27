var AppDispatcher = require('../dispatcher/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/user-constants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _isWorking = false;
var _queue = 0;

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
    switch(action.actionType) {
        case UserConstants.USERS_BOOT:
            increaseQueue();
            ProgressStore.emitChange();

          break;

        case UserConstants.USERS_RECEIVE_ALL:
            reduceQueue();
            ProgressStore.emitChange();

          break;

        default:
        // no op
    }
});

module.exports = ProgressStore;