var React = require('react');
var FormFieldMixing = require('./form-field-mixin');
var cx = require('class-set');

module.exports = React.createClass({
    mixins: [
        FormFieldMixing
    ],

    propTypes: {
        options: React.PropTypes.array.isRequired
    },

    render: function() {
        var labelClassNames = cx({
            'active': true,
            'red-text': !!this.props.error
        });

        var label = this.props.error ? this.props.label + ' \u00b7 ' + this.props.error : this.props.label;

        return (
            <div className="row">
                <div className="input-field col s12">
                    <label className={labelClassNames} htmlFor={this.props.id}>
                        {label}
                    </label><br/>
                    <select ref="Input" className="browser-default" id={this.props.id} defaultValue={this.props.defaultValue}>
                        {this._getOptions()}
                    </select>
                </div>
            </div>
        );
    },

    _getOptions: function() {
        return this.props.options.map(function(optionInLoop, index) {
            return (
                <option key={optionInLoop.value} value={optionInLoop.value}>{optionInLoop.label}</option>
            );
        });
    },

    getValue: function() {
        return React.findDOMNode(this.refs.Input).value;
    },

    clearValue: function() {
        React.findDOMNode(this.refs.Input).value = '';
    }
});