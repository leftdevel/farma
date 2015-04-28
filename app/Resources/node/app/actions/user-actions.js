var AppDispatcher = require('../dispatcher/app-dispatcher');
var UserConstants = require('../constants/user-constants');
var UserApi = require('../webapi/user-api.js');

var UserActions = {

    // LIST

    fetchUsers: function(isBackground) {
        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_GET_ALL,
            isBackground: isBackground,
        });

        UserApi.fetchUsers(UserActions.receiveUsers.bind(null, isBackground));
    },

    receiveUsers: function(isBackground, users) {
        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_RECEIVE_ALL,
            users: users,
            isBackground: isBackground,
        });
    },

    createUser: function(data) {
        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_CREATE,
        });

        UserApi.createUser(data, UserActions.createSuccess);
    },

    createSuccess: function() {
        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_CREATE_SUCCESS
        });

        // @TODO Move this to a socket aware util
        UserActions.fetchUsers();
    },

    // UI

    changeView: function(view) {
        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_UI_CHANGE_VIEW,
            view: view
        });
    },

    // FORM

    updateForm: function(property, value) {
        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_FORM_UPDATE,
            property: property,
            value: value
        });
    }
};

module.exports = UserActions;