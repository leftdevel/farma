var React = require('react');
var DateUtils = require('../../../lib/date/date-utils');
var MoneyUtils = require('../../../lib/money/money-utils');
var currency = require('../../../utils/settings-utils').getSettings().currency;
var cx = require('class-set');

function getExpiryData(expiry) {
    var monthsLeft = expiry ?
        DateUtils().fromTimestampUTC(expiry).toDateTimeLocal().monthsLeft() :
       ''
    ;

    var data = {
        label: '',
        status: ''
    };

    if (monthsLeft < 0) {
        monthsLeft = Math.abs(monthsLeft);
        data.label =  monthsLeft + (monthsLeft === 1 ? ' mes atrás' : ' meses atrás');
        data.status = 'urgent';
    } else if (monthsLeft === 0) {
        data.label = 'este mes';
        data.status = 'urgent';
    } else {
        data.label = monthsLeft + ( monthsLeft === 1 ? ' mes' : ' meses');
        data.status = monthsLeft === 1 ? 'notice' : '';
    }

    return data;
}

var ListTable = React.createClass({
    propTypes: {
        filteredItems: React.PropTypes.array.isRequired
    },

    render: function() {
        var medicines = this.props.filteredItems;

        var getRow = function(medicine) {
            var expiryFirstData = getExpiryData(medicine.expiry_first);

            return (
                <tr key={medicine.id}>
                    <td>{medicine.name} - {medicine.presentation} - {medicine.concentration} <span className="helper-text">({medicine.generic})</span></td>
                    <td>{medicine.laboratory}</td>
                    <td>{medicine.quantity}</td>
                    <td>{currency}{MoneyUtils.centsToUnits(medicine.cost)}</td>
                    <td>{currency}{MoneyUtils.centsToUnits(medicine.price)}</td>
                    <td><span className={expiryFirstData.status}>{expiryFirstData.label}</span></td>
                </tr>
            );
        };

        return (
            <table className="hoverable">
                <thead>
                    <tr>
                        <th>Medicamento</th>
                        <th>Laboratorio</th>
                        <th>Cantidad</th>
                        <th>Costo</th>
                        <th>Precio</th>
                        <th>Expira En</th>
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