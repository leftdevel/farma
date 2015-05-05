var React = require('react');
var CreateLink = require('../../core/create-link');
var Wrapper = require('../../wrapper');
var MedicineStore = require('../../../stores/medicine-store');

function getState() {
    return {
        medicines: MedicineStore.getMedicines()
    };
}

var List = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        MedicineStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        MedicineStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(getState);
    },

    render: function() {
        return (
            <Wrapper title = "Inventario - Medicinas">
                <CreateLink title='Registrar Nueva Medicina' clickHandler={this._onCreateLinkClick} />
                {this._getTable()}
            </Wrapper>
        );
    },

    _onCreateLinkClick: function() {
        //this.context.router.transitionTo('users-create');
    },

    _getTable: function() {
        var records = this.state.medicines.map(function(medicine) {
            return (
                <tr key={medicine.id}>
                    <td>{medicine.name}</td>
                    <td>{medicine.generic}</td>
                    <td>{medicine.presentation}</td>
                    <td>{medicine.laboratory}</td>
                </tr>
            );
        });

        return (
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Genérico</th>
                        <th>Presentación</th>
                        <th>Laboratorio</th>
                    </tr>
                </thead>
                <tbody>
                    {records}
                </tbody>
            </table>
        );
    }
});

module.exports = List;