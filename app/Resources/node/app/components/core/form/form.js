var React = require('react');

module.exports = React.createClass({

    clearAll: function() {
        // @TODO Clear all fields
    },

    fetchAll: function() {
        // @TODO fetch all fields values
    },

    render: function() {
        <form className="col s12" method="post">
            {this.props.children}
        </form>
    }
});