var AppDispatcher = require('../dispatcher/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var MedicineConstants = require('../constants/medicine-constants');

var CHANGE_EVENT = 'change';
var _has_booted = false;
var _medicines = [];

var MedicineStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getMedicines: function() {
        return _medicines;
    },

    hasBooted: function() {
        return _has_booted;
    }
});

AppDispatcher.register(function(action) {
    switch (action.actionType) {
        case MedicineConstants.MEDICINES_SET_ALL:
            _medicines = action.medicines;
            _has_booted = true;
            MedicineStore.emitChange();
            break;

        default:
            // no op
    }
});

module.exports = MedicineStore;