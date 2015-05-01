var AppDispatcher = require('../dispatcher/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ModalConstants = require('../constants/modal-constants');
var ModalUtils = require('../utils/modal-utils');

var CHANGE_EVENT = 'change';

var defaults = {
    title: null,
    content: null,
    isConfirm: null,
};

var _modal = assign({}, defaults);

function setModal(action) {
    _modal.title = action.title;
    _modal.content = action.content;
    _modal.isConfirm = action.isConfirm ;

    ModalUtils.renderOverlay();
}

function confirmModal() {
    // Just dismiss. See ModalActions
    clearModal();
}

function clearModal() {
    _modal = assign({}, defaults);
    ModalUtils.removeOverlay();
}

var ModalStore = assign({}, EventEmitter.prototype, {
    getTitle: function() {
        return _modal.title;
    },

    getContent: function() {
        return _modal.content;
    },

    isConfirm: function() {
        return _modal.isConfirm;
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

        case ModalConstants.MODAL_OPEN:
            setModal(action);
            ModalStore.emitChange();
            break;

        case ModalConstants.MODAL_CANCEL:
            clearModal();
            ModalStore.emitChange();
            break;

        case ModalConstants.MODAL_CONFIRM:
            confirmModal();
            ModalStore.emitChange();
            break;

        default:
            // no op
    }
});

module.exports = ModalStore;