var React = require('react');
var FormFieldMixing = require('./form-field-mixin');

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