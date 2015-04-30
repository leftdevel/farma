var React = require('react');

module.exports = {
    PropTypes: {
        fields: React.PropTypes.object.isRequired,
        changeHandler: React.PropTypes.func.isRequired,
        submitHandler: React.PropTypes.func.isRequired,
    }
};