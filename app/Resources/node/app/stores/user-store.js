var assign = require('object-assign');
var deepAssign = require('object-assign-deep');
var AppDispatcher = require('../dispatcher/app-dispatcher');
var EventEmitter = require('events').EventEmitter;

var SettingsUtil = require('../utils/settings-utils');
var UserConstants = require('../constants/user-constants');
var UserUtils = require('../utils/user-utils');
var _roles = UserUtils.getRoles();

var CHANGE_EVENT = 'change';
var allowedViews = ['list', 'create', 'edit'];

var defaultFields = {
    full_name: {value: '', error: ''},
    email: {value: '', error: ''},
    role: {value: _roles.ROLE_ADMIN, error: ''}, // One role at a time for current version.
    password: {value: '', error: ''},
    repeat_password: {value: '', error: ''}
};

var _data = {
    users: [],

    view: allowedViews[0],

    form: {
        create: {
            fields: deepAssign({}, defaultFields)
        },

        edit: {
            userId: null,
            updatePassword: false,
            fields: deepAssign({}, defaultFields)
        }
    }
};

// LIST

function setUsers(users) {
    if (SettingsUtil.isSuperAdmin()) {
        _data.users = users;
    } else {
        _data.users = users.filter(function(user) {
            return user.roles.indexOf(_roles.ROLE_SUPER_ADMIN) === -1;
        });
    }
}

// UI

function changeView(view) {
    if (allowedViews.indexOf(view) === -1) {
        message = 'Invliad view';
        alert(message);
        throw message;
    }

    _data.view = view;
}

function toggleUpdatePassword() {
    _data.form.edit.updatePassword = !_data.form.edit.updatePassword;
}

// FORM

function updateFormValue(propertyPath, value) {
    var fields = getFieldsForCurrentView();
    fields[propertyPath].value = value;
}

function getFieldsForCurrentView() {
    var fields;

    if (_data.view === 'create') {
        fields = _data.form.create.fields;
    } else if (_data.view === 'edit') {
        fields = _data.form.edit.fields;
    } else {
        var message = 'Form cannot be updated while hidden';
        alert(message);
        throw message;
    }

    return fields;
}

function clearFields() {
    _data.form.create.fields = deepAssign({}, defaultFields);
    _data.form.edit.fields = deepAssign({}, defaultFields);
    _data.form.edit.userId = null;
    _data.form.edit.updatePassword = false;
}

function setFormErrors(errors) {
    var fields = getFieldsForCurrentView();

    for (var i in errors) {
        var error = errors[i];
        fields[error.propertyPath].error = error.errorMessage;
    }
}


function prefillEditForm(userId) {
    var user = findOneUserById(userId);

    if (!user) {
        var errorMessage = 'User not found!';
        alert(errorMessage);
        throw errorMessage;
    }

    _data.form.edit.userId = userId;
    var fields = getFieldsForCurrentView();
    fields.full_name.value = user.full_name;
    fields.email.value = user.email;

    // Roles are fetched as array but we only support
    // one role at a time in current frontend version
    // for the form specifically.
    fields.role.value = user.roles[0];
}

function findOneUserById(userId) {
    var users = _data.users;

        for (var i in users) {
            var user = users[i];

            if (user.id == userId) {
                return user;
            }
        }

        return null;
}

// STORE

var UserStore = assign({}, EventEmitter.prototype, {
    getUsers: function() {
        return _data.users;
    },

    findOneUserById: function(userId) {
        return findOneUserById(userId);
    },

    getView: function() {
        return _data.view;
    },

    getCreateFields: function() {
        return _data.form.create.fields;
    },

    getEditFields: function() {
        return _data.form.edit.fields;
    },

    isUpdatePassword: function() {
        return _data.form.edit.updatePassword;
    },

    getUserIdInEditForm: function() {
        return _data.form.edit.userId;
    },

    getFormEntity: function() {
        var fields = getFieldsForCurrentView();
        var entity = {};

        entity.full_name = fields.full_name.value;
        entity.email = fields.email.value;
        entity.roles = [fields.role.value]; // Backend API expects array

        if (_data.view === 'edit') {
            entity.id = _data.form.edit.userId;

            if (_data.form.edit.updatePassword) {
                entity.password = fields.password.value;
            }
        } else {
            entity.password = fields.password.value;
        }

        return entity;
    },

    // EventEMitter

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
});

AppDispatcher.register(function(action) {
    var text;

    switch(action.actionType) {

        // LIST

        case UserConstants.USERS_SET_ALL:
            setUsers(action.users);
            UserStore.emitChange();
            break;

        // CREATE

        case UserConstants.USERS_CREATE_SUCCESS:
            changeView('list');
            UserStore.emitChange();
            break;

        // UPATE

        case UserConstants.USERS_UPDATE_SUCCESS:
            changeView('list');
            UserStore.emitChange();
            break;

        // UI

        case UserConstants.USERS_UI_TOGGLE_LIST:
            changeView('list');
            UserStore.emitChange();
            break;

        case UserConstants.USERS_UI_TOGGLE_CREATE:
            changeView('create');
            clearFields();
            UserStore.emitChange();
            break;

        case UserConstants.USERS_UI_TOGGLE_EDIT:
            changeView('edit');
            clearFields();
            prefillEditForm(action.userId);
            UserStore.emitChange();
            break;

        case UserConstants.USERS_UI_TOGGLE_UPDATE_PASSWORD:
            toggleUpdatePassword();
            UserStore.emitChange();
            break;

        // FORM

        case UserConstants.USERS_FORM_UPDATE_VALUE:
            updateFormValue(action.propertyPath, action.value);
            UserStore.emitChange();
            break;

        case UserConstants.USERS_FORM_SET_ERRORS:
            setFormErrors(action.errors);
            UserStore.emitChange();
            break;

        // EMAIL

        case UserConstants.USERS_FORM_VALIDATE_EMAIL_SUCCESS:
            handleAsyncFormErrors(action.users);
            UserStore.emitChange();
            break;

        default:
        // no op
    }
});

module.exports = UserStore;