var React = require('react');
var CreateLink = require('../../core/create-link');
var Wrapper = require('../../wrapper');
var MedicineStore = require('../../../stores/medicine-store');
var SmartTable = require('../../core/smart-table');
var ListTable = require('./list-table');

var searchableProperties = ['name_normalized', 'generic_normalized', 'presentation_normalized', 'laboratory_normalized'];

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
                <SmartTable
                    items={this.state.medicines}
                    title='Buscar'
                    placeholder='cualquier término'
                    searchTermNormalizer={this._searchsearchTermNormalizer}
                    searchableProperties={searchableProperties}>

                    <ListTable filteredItems={[]} key="0" />

                </SmartTable>
            </Wrapper>
        );
    },

    _onCreateLinkClick: function() {
        //this.context.router.transitionTo('users-create');
    },

    _searchsearchTermNormalizer: function(value) {
        return value.toLowerCase();
    },

    _onFilter: function(filteredMedicines) {
        this.setState({filteredMedicines: filteredMedicines});
    },


});

module.exports = List;