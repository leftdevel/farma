var AppDispatcher = require('../dispatcher/app-dispatcher');
var SettingsConstants = require('../constants/settings-constants');
var SettingsApi = require('../webapi/settings-api.js');

var _readyCallback;

var SettingsActions = {
    ready: function(readyCallback) {
        _readyCallback = readyCallback;
        SettingsActions._fetchSettings();
    },

    _fetchSettings: function() {
        AppDispatcher.dispatch({
            actionType: SettingsConstants.SETTINGS_FETCH_ALL
        });

        SettingsApi.fetchSettings(SettingsActions._setSettings);
    },

    _setSettings: function(settings) {
        AppDispatcher.dispatch({
            actionType: SettingsConstants.SETTINGS_SET_ALL,
            settings: settings
        });

        _readyCallback();
    }
};

module.exports = SettingsActions;