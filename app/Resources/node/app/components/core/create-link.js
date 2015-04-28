var React = require('react');
var cx = require('class-set');

module.exports = React.createClass({
    propTypes: {
        title: React.PropTypes.string.isRequired,
        isVisible: React.PropTypes.bool.isRequired,
        clickHandler: React.PropTypes.func.isRequired
    },

    render: function () {
        var classNames = cx({
            'float': true,
            'right': true,
            'hide': !this.props.isVisible
        });

        return (
            <div className={classNames}>
                <a href="#" onClick={this._onClick} className="waves-effect waves-light">{this.props.title}</a>
                &nbsp;
                <a href="#" onClick={this._onClick} className="btn-floating btn-large waves-effect waves-light red">
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