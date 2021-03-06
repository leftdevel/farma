var React = require('react');

module.exports = {
    propTypes: {
        id: React.PropTypes.string.isRequired,
        noWrap: React.PropTypes.bool,
        label: React.PropTypes.string,
        error: React.PropTypes.string,
        disabled: React.PropTypes.bool,
        placeholder: React.PropTypes.string,
        changeHandler: React.PropTypes.func.isRequired,
        value: React.PropTypes.node // string, number, or array of values
    }
};