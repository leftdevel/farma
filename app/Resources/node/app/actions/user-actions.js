var AppDispatcher = require('../dispatcher/app-dispatcher');
var UserConstants = require('../constants/user-constants');
var UserApi = require('../webapi/user-api.js');

var UserActions = {
    boot: function() {
        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_BOOT,
        });

        UserApi.getUsers(this.receiveUsers);
    },

    receiveUsers: function(users) {
        AppDispatcher.dispatch({
            actionType: UserConstants.USERS_RECEIVE_ALL,
            users: JSON.parse(users)
        });
    }
};

module.exports = UserActions;