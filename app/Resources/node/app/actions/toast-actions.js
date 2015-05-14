var AppDispatcher = require('../dispatcher/app-dispatcher');
var ToastConstants = require('../constants/toast-constants');

var ToastActions = {
    showToast: function(toast) {
        AppDispatcher.dispatch({
            actionType: ToastConstants.TOAST_SHOW,
            toast: toast
        });
    }
};

module.exports = ToastActions;

window.ToastActions = ToastActions;
