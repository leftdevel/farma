var keyMirror = require('keymirror');

var UserConstants = keyMirror({

    // LIST

    USERS_GET_ALL: null,
    USERS_SET_ALL: null,
    USERS_CREATE: null,
    USERS_CREATE_SUCCESS: null,

    // UI

    USERS_UI_CHANGE_VIEW: null,

    // FORM

    USERS_FORM_UPDATE_VALUE: null,
    USERS_FORM_SET_ERRORS: null
});

module.exports = UserConstants;