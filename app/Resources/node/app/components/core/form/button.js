var React = require('react');

module.exports = React.createClass({
    propTypes: {
        label: React.PropTypes.string.isRequired,
        clickHandler: React.PropTypes.func.isRequired,
        iconClassName: React.PropTypes.string
    },

    _getIconClassNames: function() {
        var classNames = this.props.iconClassName ? this.props.iconClassName : 'mdi-content-send';

        return classNames + ' right';
    },

    render: function() {
        return (
            <div className="row">
                <div className="col s12">
                    <button className="btn waves-effect waves-light">
                        {this.props.label}
                        <i className={this._getIconClassNames()}></i>
                    </button>
                </div>
            </div>
        );
    }
});