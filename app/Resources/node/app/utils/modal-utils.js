var ModalActions  = require('../actions/modal-actions');
var overlayId = 'lean-overlay';

var clickHandler;

module.exports = {
    renderOverlay: function() {
        if (!document) return; // For when 'document' is not available, eg NodeJS.
        var existingDom = document.getElementById(overlayId);
        if (existingDom) return;

        var overlayDiv = document.createElement('div');
        overlayDiv.setAttribute('id', 'lean-overlay');
        document.body.appendChild(overlayDiv);

        clickHandler = function() {
            ModalActions.cancel();
        };

        overlayDiv.addEventListener('click', clickHandler);
    },

    removeOverlay: function() {
        if (!document) return;
        var overlayDiv = document.getElementById(overlayId);
        if (overlayDiv) {
            overlayDiv.removeEventListener('click', clickHandler);
            document.body.removeChild(overlayDiv);
        }
    }
};