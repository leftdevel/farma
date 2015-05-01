var AppDispatcher = require('../dispatcher/app-dispatcher');
var ModalConstants = require('../constants/modal-constants');
var ModalStore = require('../stores/modal-store');

var _confirmCallback;

var ModalActions = {

    // Will intercept a confirmCallback. Handled here instead the store in order to avoid
    // the invariant violation about running an action while another action is being dispatched.
    open: function(title, content, confirmCallback) {
        _confirmCallback = confirmCallback;

        console.log(_confirmCallback);

        AppDispatcher.dispatch({
            actionType: ModalConstants.MODAL_OPEN,
            title: title,
            content: content,
            isConfirm: typeof confirmCallback !== 'undefined'
        });
    },

    cancel: function() {
        AppDispatcher.dispatch({
            actionType: ModalConstants.MODAL_CANCEL
        });

        _confirmCallback = null;
    },

    confirm: function() {
        AppDispatcher.dispatch({
            actionType: ModalConstants.MODAL_CONFIRM
        });

        runAndClearConfirmCallback();
    }
};

function runAndClearConfirmCallback() {
    if (!_confirmCallback) {
        var errorMessage = 'There is no confirm callback registered!';
        alert(errorMessage);
        throw errorMessage;
    }

    _confirmCallback();
    _confirmCallback = null;
}

module.exports = ModalActions;