var React = require('react');
var ModalStore = require('../stores/modal-store');
var ModalActions = require('../actions/modal-actions');

function getState() {
    return {
        title: ModalStore.getTitle(),
        content: ModalStore.getContent(),
        isConfirm: ModalStore.isConfirm(),
    };
}

var Modal = React.createClass({
    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        ModalStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ModalStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(getState());
    },

    render: function() {
        if (!this.state.title) return null;

        return (
            <div id="modal1" className="modal">
                <div className="modal-content">
                    <h4>{this.state.title}</h4>
                    <p>{this.state.content}</p>
                </div>
                <div className="modal-footer">
                    {this._getCancelButtonForContext()}
                    {this._getConfirmButtonForContext()}
                </div>
            </div>
        );
    },

    _getConfirmButtonForContext: function() {
        if (!this.state.isConfirm) return null;

        return (
            <a href="#" onClick={this._onConfirmClick} className="modal-action modal-close waves-effect waves-green btn-flat">Confirmar</a>
        );
    },

    _getCancelButtonForContext: function() {
        return (
            <a href="#" onClick={this._onCancelClick} className="modal-action modal-close waves-effect waves-red btn-flat">{this.state.isConfirm ? 'Cancelar' : 'Cerrar'}</a>
        );
    },

    _onConfirmClick: function(event) {
        event.preventDefault();
        ModalActions.confirm();
    },

    _onCancelClick: function(event) {
        event.preventDefault();
        ModalActions.cancel();
    }
});

module.exports = Modal;