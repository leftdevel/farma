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

        UserApi.fetchUsers(UserActions.setUsers.bind(null, isBackground));
    },

    setUsers: function(isBackground, users) {
        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_SET_ALL,
            users: users,
            isBackground: isBackground,
        });
    },

    createUser: function(data) {
        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_CREATE,
        });

        UserApi.createUser(data, UserActions.createUserSuccess);
    },

    createUserSuccess: function() {
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

    updateFormValue: function(propertyPath, value) {
        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_FORM_UPDATE_VALUE,
            propertyPath: propertyPath,
            value: value
        });
    },

    setFormErrors: function(errors) {
        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_FORM_SET_ERRORS,
            errors: errors
        });
    }
};

module.exports = UserActions;