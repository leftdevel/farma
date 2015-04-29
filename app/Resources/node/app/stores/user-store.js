var assign = require('object-assign');
var deepAssign = require('object-assign-deep');

var AppDispatcher = require('../dispatcher/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/user-constants');
var UserUtils = require('../utils/user-utils');
var roles = UserUtils.getRoles();


var CHANGE_EVENT = 'change';
var allowedViews = ['list', 'create', 'edit'];

var defaultFields = {
    full_name: {value: '', error: ''},
    email: {value: '', error: ''},
    flat_roles: {value: roles.ROLE_ADMIN, error: ''},
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
            update_password: false,
            fields: deepAssign({}, defaultFields)
        }
    }
};

// lIST

function setUsers(users) {
    _data.users = users;
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
    _data.form.edit.update_password = false;
}

function setFormErrors(errors) {
    var fields = getFieldsForCurrentView();

    for (var i in errors) {
        var error = errors[i];
        fields[error.propertyPath].error = error.errorMessage;
    }
}

// STORE

var UserStore = assign({}, EventEmitter.prototype, {
    getUsers: function() {
        return _data.users;
    },

    findOne: function(id) {
        var users = _data.users;

        for (var i in users) {
            var user = users[i];

            if (user.id === id) {
                return user;
            }
        }

        return null;
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

    getFormEntity: function() {
        var fields = getFieldsForCurrentView();
        var entity = {};

        entity.full_name = fields.full_name.value;
        entity.email = fields.email.value;
        entity.flat_roles = fields.flat_roles.value;

        if (_data.view === 'edit') {
            entity.userId = _data.form.edit.userId;

            if (_data.form.edit.update_password) {
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
        case UserConstants.USERS_SET_ALL:
            setUsers(action.users);
            UserStore.emitChange();
            break;

        case UserConstants.USERS_CREATE_SUCCESS:
            changeView('list');
            UserStore.emitChange();
            break;

        case UserConstants.USERS_UI_CHANGE_VIEW:
            changeView(action.view);
            clearFields();
            UserStore.emitChange();
            break;

        case UserConstants.USERS_FORM_UPDATE_VALUE:
            updateFormValue(action.propertyPath, action.value);
            UserStore.emitChange();
            break;

        case UserConstants.USERS_FORM_SET_ERRORS:
            setFormErrors(action.errors);
            UserStore.emitChange();
            break;

        default:
        // no op
    }
});

module.exports = UserStore;