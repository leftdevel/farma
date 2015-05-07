var React = require('react');
var Wrapper = require('../../wrapper');
var MedicineStore = require('../../../stores/medicine-store');

function getStateFromStore(medicineId) {
    var medicine = MedicineStore.findOneById(medicineId);

    return {
        medicine: medicine,
        hasStoreBooted: MedicineStore.hasBooted()
    };
}

var View = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        var medicineId = this.context.router.getCurrentParams().medicineId;
        return getStateFromStore(medicineId);
    },

    componentDidMount: function() {
        MedicineStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        MedicineStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        var medicineId = this.context.router.getCurrentParams().medicineId;
        this.setState(getStateFromStore(medicineId));
    },

    render: function() {

        return (
            <Wrapper title="Inventario - Medicamentos - Detalle">
                {this._getViewOrNotFound()}
            </Wrapper>
        );
    },

    _getViewOrNotFound: function() {
        if (!MedicineStore.hasBooted()) {
            return null;
        }

        if (!this.state.medicine) {
            this.context.router.transitionTo('inventory-medicines');
            return null;
        }

        return (
            <div>

            </div>
        );
    }
});

module.exports = View;