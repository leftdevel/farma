var AppDispatcher = require('../dispatcher/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/user-constants');
var assign = require('object-assign');
var deepAssign = require('object-assign-deep');

var CHANGE_EVENT = 'change';
var allowedViews = ['list', 'create', 'edit'];

var defaultFields = {
    full_name: {value: '', error: ''},
    email: {value: '', error: ''},
    role: {value: '', error: ''},
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

function updateForm(property, value) {
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

    fields[property].value = value;
}

function clearFields() {
    _data.form.create.fields = deepAssign({}, defaultFields);
    _data.form.edit.fields = deepAssign({}, defaultFields);
    _data.form.edit.userId = null;
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
        case UserConstants.USERS_RECEIVE_ALL:
            setUsers(action.users);
            UserStore.emitChange();
            break;

        case UserConstants.USERS_UI_CHANGE_VIEW:
            changeView(action.view);
            clearFields();
            UserStore.emitChange();
            break;

        case UserConstants.USERS_FORM_UPDATE:
            updateForm(action.property, action.value);
            UserStore.emitChange();
            break;

        default:
        // no op
    }
});

module.exports = UserStore;