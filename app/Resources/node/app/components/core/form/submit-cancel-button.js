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
            <button onClick={this._cancel} type="button" className="btn waves-effect waves-light  grey">
                Cancelar
            </button>
        );

        var submitButton = (
            <button onClick={this._submit} type="button" className="btn waves-effect waves-light light-blue darken-3">
                {this.props.label}
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
