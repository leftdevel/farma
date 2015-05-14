var AppDispatcher = require('../dispatcher/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var ToastConstants = require('../constants/toast-constants');
var CHANGE_EVENT = 'change';

var _data = {
    toasts: {}
};

function show(toast) {
    var _id = Date.now();

    var _timerId = setTimeout(function() {
        delete _data.toasts[_id];
        ToastStore.emitChange();
    }, 5000);

    var el = {
        toast: toast,
        _id: _id,
        _timerId: _timerId
    };

    _data.toasts[_id] = el;
}

var ToastStore = assign({}, EventEmitter.prototype, {
    getData: function() {
        return _data;
    },

    getToastsIterator: function() {
        var toasts = [];

        for (var i in _data.toasts) {
            var toast = _data.toasts[i];
            toasts.push(toast);
        }

        return toasts;
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

AppDispatcher.register(function(action) {
    switch (action.actionType) {
        case ToastConstants.TOAST_SHOW:
            show(action.toast);
            ToastStore.emitChange();
            break;

        default:
            // no op
    }
});

module.exports = ToastStore;
