var AppDispatcher = require('../dispatcher/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var RouteConstants = require('../constants/route-constants');

var CHANGE_EVENT = 'change';

var _routing = null;

var RouteStore = assign({}, EventEmitter.prototype, {
    getRouting: function() {
        return _routing;
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
        case RouteConstants.ROUTE_CHANGE:
            _routing = action.routing;
            RouteStore.emitChange();
            break;

        default:
            // no op
    }
});

module.exports = RouteStore;