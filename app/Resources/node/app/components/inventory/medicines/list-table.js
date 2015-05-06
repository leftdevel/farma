var React = require('react');
var DateUtils = require('../../../lib/date/date-utils');


var ListTable = React.createClass({
    propTypes: {
        filteredItems: React.PropTypes.array.isRequired
    },

    render: function() {
        var medicines = this.props.filteredItems;

        var getRow = function(medicine) {
            var expiryFirst = medicine.expiry_first ? DateUtils.fromTimestampUTC(medicine.expiry_first).toDateTimeLocal().format('M, Y') : '';
            var expiryLast = medicine.expiry_last ? DateUtils.fromTimestampUTC(medicine.expiry_last).toDateTimeLocal().format('M, Y') : '';

            return (
                <tr key={medicine.id}>
                    <td>{medicine.name}</td>
                    <td>{medicine.generic}</td>
                    <td>{medicine.laboratory}</td>
                    <td>{medicine.presentation}</td>
                    <td>{medicine.concentration}</td>
                    <td>{medicine.quantity}</td>
                    <td>{medicine.cost}</td>
                    <td>{medicine.price}</td>
                    <td>{expiryFirst === expiryLast ? expiryFirst : expiryFirst + ' / ' + expiryLast}</td>
                </tr>
            );
        };

        return (
            <table className="hoverable">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Genérico</th>
                        <th>Laboratorio</th>
                        <th>Presentación</th>
                        <th>Concentración</th>
                        <th>Cantidad</th>
                        <th>Costo</th>
                        <th>Precio</th>
                        <th>Expira</th>
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