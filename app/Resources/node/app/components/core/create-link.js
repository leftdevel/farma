var React = require('react');

module.exports = React.createClass({
    propTypes: {
        title: React.PropTypes.string.isRequired,
        clickHandler: React.PropTypes.func.isRequired
    },

    render: function () {
        return (
            <div className="float right">
                <a href="#" onClick={this._onClick} className="waves-effect waves-light">{this.props.title}</a>
                &nbsp;
                <a href="#" onClick={this._onClick} className="btn-floating btn-large waves-effect waves-light light-blue darken-3">
                    <i className="mdi-content-add"></i>
                </a>
            </div>
        );
    },

    _onClick: function(event) {
        event.preventDefault();
        this.props.clickHandler();
    }
});
