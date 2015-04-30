var AppDispatcher = require('../dispatcher/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var SettingsConstants = require('../constants/settings-constants');

var CHANGE_EVENT = 'change';
var _settings = {};

var SettingsStore = assign({}, EventEmitter.prototype, {
    getSettings: function() {
        return _settings;
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
    switch (action.actionType) {
        case SettingsConstants.SETTINGS_SET_ALL:
            _settings = action.settings;
            SettingsStore.emitChange();
            break;

        default:
            // no op
    }
});

module.exports = SettingsStore;