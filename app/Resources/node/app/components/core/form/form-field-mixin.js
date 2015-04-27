var React = require('react');

module.exports = {
    propTypes: {
        id: React.PropTypes.string.isRequired,
        label: React.PropTypes.string.isRequired,
        error: React.PropTypes.string,
        value: React.PropTypes.node // string, number, or array of values
    }
};