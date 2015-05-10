var ModalActions  = require('../actions/modal-actions');
var overlayId = 'lean-overlay';

function isBrowser() {
    return !!docuement;
}

function clickHandler() {
    ModalActions.cancel();
}

module.exports = {
    renderOverlay: function() {
        if (!isBrowser()) return;
        var existingDom = document.getElementById(overlayId);
        if (existingDom) return;

        var overlayDiv = document.createElement('div');
        overlayDiv.setAttribute('id', 'lean-overlay');
        document.body.appendChild(overlayDiv);

        overlayDiv.addEventListener('click', clickHandler);
    },

    removeOverlay: function() {
        if (!isBrowser()) return;
        var overlayDiv = document.getElementById(overlayId);
        if (overlayDiv) {
            overlayDiv.removeEventListener('click', clickHandler);
            document.body.removeChild(overlayDiv);
        }
    }
};

window.ModalActions = ModalActions;