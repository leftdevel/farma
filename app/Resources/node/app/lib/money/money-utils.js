var MoneyUtils = {
    centsToUnits: function(cents) {
        this.validateCents(cents);

        var money = cents / 100;
        var units = parseInt(money, 10);
        var decimals = money - units;
        decimals = (decimals).toString() + '00';
        decimals = decimals.slice(0, 2);

        return (units).toString() + '.' + decimals;
    },

    validateCents: function(cents) {
        if (isNaN(cents)) {
            throw "Exptected a number";
        }

        if (cents !== parseInt(cents, 10)) {
            throw "Decimals not supported";
        }
    }
};

module.exports = MoneyUtils;