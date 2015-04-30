var keyMirror = require('keymirror');

var UserConstants = keyMirror({

    // CRUD

    USERS_FETCH_ALL: null,
    USERS_SET_ALL: null,

    USERS_CREATE: null,
    USERS_CREATE_SUCCESS: null,

    USERS_UPDATE: null,
    USERS_UPDATE_SUCCESS: null,

    // UI

    USERS_UI_TOGGLE_LIST: null,
    USERS_UI_TOGGLE_CREATE: null,
    USERS_UI_TOGGLE_EDIT: null,
    USERS_UI_TOGGLE_UPDATE_PASSWORD: null,

    // FORM

    USERS_FORM_UPDATE_VALUE: null,
    USERS_FORM_SET_ERRORS: null
});

module.exports = UserConstants;