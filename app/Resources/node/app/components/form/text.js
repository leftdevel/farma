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
        if (!this.props.display || this.props.display === 'block') {
            return this._renderBlock();
        } else {
            return this._renderInline();
        }
    },

    _renderBlock: function() {
        var inputType = this.props.inputType ? this.props.inputType : 'text';

        return (
            <div className="row">
                <div className="input-field col s12">
                    <input
                        ref="Input"
                        id={this.props.id}
                        type={inputType}
                        placeholder={this.props.placeholder}
                        defaultValue={this.props.defaultValue} />
                    {this._getLabel()}
                </div>
            </div>
        );
    },

    _getLabel: function() {
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

        return label;
    },

    _renderInline: function() {
        var inputType = this.props.inputType ? this.props.inputType : 'text';

        return (
            <input
                ref="Input"
                className={this.props.error ? 'invalid' : ''}
                id={this.props.id}
                type={inputType}
                placeholder={this.props.placeholder}
                defaultValue={this.props.defaultValue} />
        );
    },

    getValue: function() {
        return React.findDOMNode(this.refs.Input).value;
    },

    clearValue: function() {
        React.findDOMNode(this.refs.Input).value = '';
    }
});