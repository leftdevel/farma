var AppDispatcher = require('../dispatcher/app-dispatcher');
var UserConstants = require('../constants/user-constants');
var UserApi = require('../webapi/user-api.js');

var UserActions = {
    getAll: function(isBackground) {
        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_GET_ALL,
            isBackground: isBackground,
        });

        UserApi.getAll(UserActions.receiveUsers.bind(null, isBackground));
    },

    receiveUsers: function(isBackground, users) {
        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_RECEIVE_ALL,
            users: users,
            isBackground: isBackground,
        });
    },

    create: function(data) {
        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_CREATE,
        });

        UserApi.create(data, UserActions.createSuccess);
    },

    createSuccess: function() {
        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_CREATE_SUCCESS
        });

        // @TODO Move this to a socket aware util
        UserActions.getAll();
    }
};

module.exports = UserActions;