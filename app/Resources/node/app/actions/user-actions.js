var AppDispatcher = require('../dispatcher/app-dispatcher');
var UserConstants = require('../constants/user-constants');
var UserApi = require('../webapi/user-api.js');

var isSubmitting = false; // Prevent re-submit

var UserActions = {

    // LIST

    fetchUsers: function(isBackground) {
        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_FETCH_ALL,
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

    // CREATE

    createUser: function(data) {
        if (isSubmitting) return;
        isSubmitting = true;

        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_CREATE,
        });

        UserApi.createUser(data, UserActions.createUserSuccess);
    },

    createUserSuccess: function() {
        isSubmitting = false;

        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_CREATE_SUCCESS
        });

        // @TODO Move this to a socket aware util
        UserActions.fetchUsers();
    },

    // UPDATE

    updateUser: function(user) {
        if (isSubmitting) return;
        isSubmitting = true;

        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_UPDATE,
            user: user
        });

        UserApi.updateUser(user, UserActions.updateUserSuccess);
    },

    updateUserSuccess: function() {
        isSubmitting = false;

        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_UPDATE_SUCCESS
        });

        // @TODO Move this to a socket aware util
        UserActions.fetchUsers();
    },

    // DELETE

    deleteUser: function(userId) {
        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_DELETE,
            userId: userId
        });

        UserApi.deleteUser(userId, UserActions.deleteUserSuccess);
    },

    deleteUserSuccess: function() {
        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_DELETE_SUCCESS
        });

        // @TODO move this to a socket aware util
        UserActions.fetchUsers();
    }
};

module.exports = UserActions;