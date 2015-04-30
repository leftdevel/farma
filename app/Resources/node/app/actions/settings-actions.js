var AppDispatcher = require('../dispatcher/app-dispatcher');
var SettingsConstants = require('../constants/settings-constants');
var SettingsApi = require('../webapi/settings-api.js');

var SettingsActions = {
    fetchSettings: function() {
        AppDispatcher.dispatch({
            actionType: SettingsConstants.SETTINGS_FETCH_ALL
        });

        SettingsApi.fetchSettings(SettingsActions.setSettings);
    },

    setSettings: function(settings) {
        AppDispatcher.dispatch({
            actionType: SettingsConstants.SETTINGS_SET_ALL,
            settings: settings
        });
    }
};

module.exports = SettingsActions;