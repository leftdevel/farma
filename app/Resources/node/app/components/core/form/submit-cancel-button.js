var React = require('react');

module.exports = React.createClass({
    propTypes: {
        label: React.PropTypes.string.isRequired,
        submitClickHandler: React.PropTypes.func.isRequired,
        cancelClickHandler: React.PropTypes.func.isRequired,
        submitIconClassName: React.PropTypes.string
    },

    _getsubmitIconClassNames: function() {
        var classNames = this.props.submitIconClassName ? this.props.submitIconClassName : 'mdi-content-send';

        return classNames + ' right';
    },

    render: function() {
        var cancelButton = (
            <button onClick={this.props.cancelClickHandler} className="btn waves-effect waves-light red">
                Cancelar
                <i className="mdi-av-not-interested right"></i>
            </button>
        );

        var submitButton = (
            <button onClick={this.props.submitClickHandler} className="btn waves-effect waves-light">
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
    }
});