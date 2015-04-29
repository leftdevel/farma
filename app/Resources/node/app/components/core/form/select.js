var React = require('react');
var FormFieldMixin = require('./form-field-mixin');
var cx = require('class-set');

module.exports = React.createClass({
    mixins: [FormFieldMixin],

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
                    <select
                        className="browser-default"
                        id={this.props.id}
                        value={this.props.value}
                        onChange={this._onChange}>
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

    _onChange: function(event) {
        this.props.changeHandler(this.props.id, event.target.value);
    }
});