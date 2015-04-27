var React = require('react');

module.exports = React.createClass({
    propTypes: {
        label: React.PropTypes.string.isRequired,
        submitClickHandler: React.PropTypes.func.isRequired,
        cancelClickHandler: React.PropTypes.func.isRequired,
        iconClassName: React.PropTypes.string
    },

    _getIconClassNames: function() {
        var classNames = this.props.iconClassName ? this.props.iconClassName : 'mdi-content-send';

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
                <i className={this._getIconClassNames()}></i>
            </button>
        );

        return (
            <div className="row">
                <div className="col s2">
                    {submitButton}
                </div>
                <div className="col s10">
                    {cancelButton}
                </div>
            </div>
        );
    }
});