var date = new Date();
var offset = date.getTimezoneOffset();

var DateUtil = {
    fromTimestamp: function(unixTimestamp) {
        this.date = new Date(unixTimestamp * 1000);

        return this;
    },

    format: function(format) {
        if (!this.date) {
            throw "Date is not defined";
        }

        var year = this.date.getFullYear();
        var indexMonth = this.date.getMonth();
        var month = indexMonth + 1;
        var day = this.date.getDate();
        var hours = this.date.getHours();
        var minutes = this.date.getMinutes();
        var seconds = this.date.getMinutes();

        monthPadded = month.toString().length === 1 ? '0' + month.toString() : month;
        dayPadded = day.toString().length === 1 ? '0' + day.toString() : day;
        hoursPadded = hours.toString().length === 1 ? '0' + hours.toString() : hours;
        minutesPadded = minutes.toString().length === 1 ? '0' + minutes.toString() : minutes;
        secondsPadded = seconds.toString().length === 1 ? '0' + seconds.toString() : seconds;

        format = format.replace(/Y/g, year);
        format = format.replace(/m/g, monthPadded);
        format = format.replace(/d/g, dayPadded);
        format = format.replace(/H/g, hoursPadded);
        format = format.replace(/i/g, minutesPadded);
        format = format.replace(/s/g, secondsPadded);

        // string replacements must go after numbers.
        format = format.replace(/M/g, this.getMonthName(indexMonth));

        return format;
    },

    getMonthName: function(index) {
        return this.getMonths()[index];
    },

    getMonths: function() {
        return ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    }
};

module.exports = DateUtil;