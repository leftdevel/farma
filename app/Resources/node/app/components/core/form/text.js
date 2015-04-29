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

       return (
            <div className="row">
                <div className="input-field col s12">
                    <input
                        id={this.props.id}
                        type={inputType}
                        placeholder={this.props.placeholder}
                        value={this.props.value}
                        onChange={this._onChange} />
                    {this._getLabel()}
                </div>
            </div>
        );
    },

    _onChange: function(event) {
        this.props.changeHandler(this.props.id, event.target.value);
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
    }
});