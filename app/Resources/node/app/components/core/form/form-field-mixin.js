var React = require('react');

module.exports = {
    propTypes: {
        id: React.PropTypes.string.isRequired,
        label: React.PropTypes.string,
        error: React.PropTypes.string,
        display: React.PropTypes.oneOf(['block', 'inline']),
        placeholder: React.PropTypes.string,
        defaultValue: React.PropTypes.node // string, number, or array of values
    }
};