var React = require('react');
var cx = require('class-set');

var Form = require('../core/form/form');
var Text = require('../core/form/text');
var SubmitCancelButton = require('../core/form/submit-cancel-button');

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
            isFormVisible: false,
            errors: {
                full_name: '',
                email: '',
                roles: '',
                password: '',
                repeat_password: '',
            }
        };
    },

    render: function() {
        var createUserLinkClassNames = cx({
            'float': true,
            'right': true,
            'hide': this.state.isFormVisible
        });

        return (
            <div>
                <div className={createUserLinkClassNames}>
                    <a href="#" onClick={this._showForm} className="waves-effect waves-light">Crear Nuevo Usuario</a>&nbsp;
                    <a href="#" onClick={this._showForm} className="btn-floating btn-large waves-effect waves-light red">
                        <i className="mdi-content-add"></i>
                    </a>
                </div>
                <form className={this.state.isFormVisible ? '' : 'hide'}>
                    <h3>Nuevo Usuario</h3>
                    <Text id="full_name" label="Nombre" error={this.state.errors.full_name} />
                    <Text id="email" label="Correo" error={this.state.errors.email} />

                    <Text inputType="password" id="password" label="Contraseña" error={this.state.errors.password} />
                    <Text inputType="password" id="repeat_password" label="Confirmar Contraseña" error={this.state.errors.repeat_password} />

                    <SubmitCancelButton cancelClickHandler={this._clearAndHideForm} submitClickHandler={this._submit} label="Crear" />
                </form>
            </div>
        );
    },

    _showForm: function(event) {
        event.preventDefault();
        this.setState({isFormVisible: true});
    },

    _clearAndHideForm: function(event) {
        event.preventDefault();
        this.setState({isFormVisible: false});
    },

    _submit: function(event) {
        event.preventDefault();
        console.log('Submitting');
    }
});