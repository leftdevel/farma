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

        var label = this.props.error ? this.props.label + ' \u00b7 ' + this.props.error : this.props.label;

        return (
            <div className="row">
                <div className="input-field col s12">
                    <input ref="Input"
                        id={this.props.id}
                        type={inputType}
                        className="validate"
                        value={this.props.value} />
                    <label className={labelClassNames} htmlFor={this.props.id}>
                        {label}
                    </label>
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