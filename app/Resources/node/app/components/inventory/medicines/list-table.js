var React = require('react');

var ListTable = React.createClass({
    propTypes: {
        filteredItems: React.PropTypes.array.isRequired
    },

    render: function() {
        var medicines = this.props.filteredItems;

        var getRow = function(medicine) {
            return (
                <tr key={medicine.id}>
                    <td>{medicine.name}</td>
                    <td>{medicine.generic}</td>
                    <td>{medicine.presentation}</td>
                    <td>{medicine.laboratory}</td>
                </tr>
            );
        };

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
                    {medicines.map(getRow)}
                </tbody>
            </table>
        );
    }
});

module.exports = ListTable;