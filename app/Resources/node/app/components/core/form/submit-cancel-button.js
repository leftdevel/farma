var React = require('react');

module.exports = React.createClass({
    propTypes: {
        label: React.PropTypes.string.isRequired,
        submitHandler: React.PropTypes.func.isRequired,
        cancelHandler: React.PropTypes.func.isRequired,
        submitIconClassName: React.PropTypes.string
    },

    _getsubmitIconClassNames: function() {
        var classNames = this.props.submitIconClassName ? this.props.submitIconClassName : 'mdi-content-send';

        return classNames + ' right';
    },

    render: function() {
        var cancelButton = (
            <button onClick={this._cancel} className="btn waves-effect waves-light red">
                Cancelar
                <i className="mdi-av-not-interested right"></i>
            </button>
        );

        var submitButton = (
            <button onClick={this._submit} className="btn waves-effect waves-light">
                {this.props.label}
                <i className={this._getsubmitIconClassNames()}></i>
            </button>
        );

        return (
            <div className="row">
                <div className="col s12">
                    {submitButton} &nbsp;&nbsp;
                    {cancelButton}
                </div>
            </div>
        );
    },

    _cancel: function(event) {
        event.preventDefault();
        this.props.cancelHandler();
    },

    _submit: function(event) {
        event.preventDefault();
        this.props.submitHandler();
    }
});