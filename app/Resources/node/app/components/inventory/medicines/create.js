var React = require('react');
var MedicineActions = require('../../../actions/medicine-actions');
var Text = require('../../core/form/text');
var Select = require('../../core/form/select');
var SubmitCancelButton = require('../../core/form/submit-cancel-button');
var Wrapper = require('../../wrapper');

// pending for refactor
var MapValidator = require('../../../lib/validator/map-validator');
var ValidationSchema = require('./common/validation-schema');
var DateUtils = require('../../../lib/date/date-utils');


function getDefaultMonth() {
    var date = new Date();
    return date.getMonth() + 1;
}

function getMonthOptions() {
    var months = DateUtils().getMonths();
    var options = [];

    options = months.map(function(month, index) {
        return {value: index, label: month};
    });

    return options;
}

function getCurrentYear() {
    var date = new Date();
    return date.getFullYear();
}

function getYearOptions() {
    var current = getCurrentYear();
    var options = [];

    for (var i = 0; i < 10; i++) {
        var value = current + i;
        options.push({value: value, label: value});
    }

    return options;
}

var Create = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            fields: {
                name: {value: '', error: ''},
                generic: {value: '', error: ''},
                laboratory: {value: '', error: ''},
                presentation: {value: '', error: ''},
                concentration: {value: '', error: ''},
                price: {value: '', error: ''},

                quantity: {value: '', error: ''},
                expiry_month: {value: getDefaultMonth(), error: ''},
                expiry_year: {value: getCurrentYear(), error: ''},
                cost: {value: '', error: ''},
            }
        };
    },

    render: function() {
        var fields = this.state.fields;
        var datetime = new Date();
        var expiryPlaceholder = (datetime.getMonth() + 3).toString() + '/' + datetime.getFullYear();

        return (
            <Wrapper title="Inventario - Medicamentos - Nuevo">
                <h5>Nuevo Medicamento</h5>
                <form>
                    <div className="row">
                        <div className="input-field col s6">
                            <Text
                                noWrap={true}
                                id="name"
                                label="Nombre"
                                value={fields.name.value}
                                changeHandler={this._onChange}
                                error={fields.name.error} />
                        </div>
                        <div className="input-field col s6">
                            <Text
                                noWrap={true}
                                id="generic"
                                label="Genérico"
                                placeholder="ejemplo: acetaminofén, ibuprofeno"
                                value={fields.generic.value}
                                changeHandler={this._onChange}
                                error={fields.generic.error} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6">
                            <Text
                                noWrap={true}
                                id="laboratory"
                                label="Laboratorio"
                                placeholder="opcional"
                                value={fields.laboratory.value}
                                changeHandler={this._onChange}
                                error={fields.laboratory.error} />
                        </div>
                        <div className="input-field col s6">
                            <Text
                                noWrap={true}
                                id="presentation"
                                label="Presentación"
                                placeholder="ejemplo: tableta, jarabe, spray"
                                value={fields.presentation.value}
                                changeHandler={this._onChange}
                                error={fields.presentation.error} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6">
                            <Text
                                noWrap={true}
                                id="concentration"
                                label="Concentración"
                                placeholder="ejemplo: 100 mg, 5 ml"
                                value={fields.concentration.value}
                                changeHandler={this._onChange}
                                error={fields.concentration.error} />
                        </div>
                        <div className="input-field col s6">
                            <Text
                                noWrap={true}
                                id="quantity"
                                label="Cantidad/Unidades"
                                value={fields.quantity.value}
                                changeHandler={this._onChange}
                                error={fields.quantity.error} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6">
                            <Text
                                noWrap={true}
                                id="cost"
                                label="Costo unitario C$"
                                placeholder="opcional - ejemplo: 0.50"
                                value={fields.cost.value}
                                changeHandler={this._onChange}
                                error={fields.cost.error} />
                        </div>
                        <div className="input-field col s6">
                            <Text
                                noWrap={true}
                                id="price"
                                label="Precio unitario C$"
                                placeholder = "ejemplo: 50"
                                value={fields.price.value}
                                changeHandler={this._onChange}
                                error={fields.price.error} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6">
                            <Select
                                id="expiry_month"
                                value={fields.expiry_month.value}
                                label={'Expira - Mes'}
                                options={getMonthOptions()}
                                changeHandler={this._onChange}
                                error={fields.expiry_month.error} />
                        </div>
                        <div className="input-field col s6">
                            <Select
                                id="expiry_year"
                                value={fields.expiry_year.value}
                                label={'Expira - Año'}
                                options={getYearOptions()}
                                changeHandler={this._onChange}
                                error={fields.expiry_year.error} />
                        </div>
                    </div>

                    <SubmitCancelButton
                        label="Crear"
                        cancelHandler={this._onCancel}
                        submitHandler={this._onSubmit} />
                </form>
            </Wrapper>
        );
    },

    _onChange: function(propertyPath, value) {
        var fields = this.state.fields;
        fields[propertyPath].value = value;
        this.setState({fields: fields});
    },

    _onCancel: function() {
        this.context.router.transitionTo('inventory-medicines');
    },

    _onSubmit: function() {
        var entity = this._getFormEntity();

        var mapValidator = this._getMapValidator(entity);
        mapValidator.validateAll();

        if (mapValidator.hasErrors) {
            this._setFormErrors(mapValidator.errors);
            return;
        }

        MedicineActions.createMedicine(entity);
        this.context.router.transitionTo('inventory-medicines');
    },

    _getMapValidator: function(entity) {
        var mapValidator = new MapValidator();

        mapValidator
            .addValidatorForPath('name', ValidationSchema.getNotBlankValidator(entity.name))
            .addValidatorForPath('generic', ValidationSchema.getNotBlankValidator(entity.generic))
            .addValidatorForPath('presentation', ValidationSchema.getNotBlankValidator(entity.presentation))
            .addValidatorForPath('concentration', ValidationSchema.getNotBlankValidator(entity.concentration))
            // numbers
            .addValidatorForPath('price', ValidationSchema.getPriceValidator(entity.price))
            .addValidatorForPath('cost', ValidationSchema.getPriceValidator(entity.cost))
            .addValidatorForPath('quantity', ValidationSchema.getQuantityValidator(entity.quantity))
        ;

        return mapValidator;
    },

    _setFormErrors: function(errors) {
        var fields = this.state.fields;

        for (var i in errors) {
            var error = errors[i];
            fields[error.propertyPath].error = error.errorMessage;
        }

        this.setState({fields: fields});
    },

    _getFormEntity: function() {
        var fields = this.state.fields;
        var entity = {};

        entity.name = fields.name.value;
        entity.generic = fields.generic.value;
        entity.laboratory = fields.laboratory.value;
        entity.presentation = fields.presentation.value;
        entity.concentration = fields.concentration.value;
        entity.price = fields.price.value;
        entity.quantity = fields.quantity.value;
        entity.cost = fields.cost.value;
        entity.expiry_month = fields.expiry_month.value;
        entity.expiry_year = fields.expiry_year.value;

        return entity;
    }
});

module.exports = Create;