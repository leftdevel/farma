var React = require('react');

var FormFieldPropsMixing = {
    propTypes: {
        id: React.PropTypes.string.isRequired,
        label: React.PropTypes.string.isRequired,
        error: React.PropTypes.string,
        value: React.PropTypes.string
    }
};

module.exports = React.createClass({
    mixins: [
        FormFieldPropsMixing
    ],

    render: function() {
        return (
            <div className="row">
                <div className="input-field col s12">
                    <input
                        id={this.props.id}
                        type="text"
                        className="validate"
                        value={this.props.value} />
                    <label
                        className="active"
                        htmlFor={this.props.id}
                        >{this.props.label}</label>
                </div>
            </div>
        );
    }
});