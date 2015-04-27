var React = require('react');

var Form = require('../core/form/form');
var Text = require('../core/form/text');
var Button = require('../core/form/button');

var Validator = require('../../lib/validator/validator');
var MapValidator = require('../../lib/validator/map-validator');
var Constraints = require('../../lib/validator/constraints/core');

var roles = [
    {value: 'ROLE_SUPER_ADMIN', label: 'dueño'},
    {value: 'ROLE_ADMIN', label: 'administrador'},
    {value: 'ROLE_SALES', label: 'vendedor'},
    {value: 'ROLE_GROCER', label: 'bodeguero'}
];



module.exports = React.createClass({
    getInitialState: function() {
        return {
            errors: {
                full_name: '',
                email: '',
                roles: '',
            }
        };
    },

    render: function() {
        return (
            <form>
                <Text id="full_name" label="Nombre" error={this.state.errors.full_name} />
                <Text id="email" label="Correo" error={this.state.errors.email} />
                <Button clickHandler={this._submit} label="Crear" />
            </form>
        );
    },

    _submit: function(event) {
        event.preventDefault();
        console.log('Submitting');
    }
});