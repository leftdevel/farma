var React = require('react');
var FormFieldMixing = require('./form-field-mixin');
var cx = require('class-set');

module.exports = React.createClass({
    mixins: [
        FormFieldMixing
    ],

    propTypes: {
        inputType: React.PropTypes.oneOf(['text', 'password']),
    },

    render: function() {
        var inputType = this.props.inputType ? this.props.inputType : 'text';
        var labelClassNames = cx({
            'active': true,
            'red-text': !!this.props.error
        });

        var label = this.props.label;

        if (this.props.error) {
            label = (
                <label className="active" htmlFor={this.props.id}>
                    {this.props.label} &middot; <span className="red-text">{this.props.error}</span>
                </label>
            );
        } else {
            label = (
                <label className="active" htmlFor={this.props.id}>
                    {this.props.label}
                </label>
            );
        }

        return (
            <div className="row">
                <div className="input-field col s12">
                    <input ref="Input"
                        id={this.props.id}
                        type={inputType}
                        defaultValue={this.props.defaultValue} />
                    {label}
                </div>
            </div>
        );
    },

    getValue: function() {
        return React.findDOMNode(this.refs.Input).value;
    },

    clearValue: function() {
        React.findDOMNode(this.refs.Input).value = '';
    }
});