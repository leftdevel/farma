var date = new Date();
var offset = date.getTimezoneOffset();

var DateUtil = function() {
    return {
        isUTC: false,

        getTimezoneOffset: function() {
            return offset;
        },

        fromTimestampUTC: function(unixTimestamp) {
            this.date = new Date(unixTimestamp * 1000);
            this.isUTC = true;
            return this;
        },

        _checkDateIsSet: function() {
            if (!this.date) {
                throw 'Date was not previously defined';
            }
        },

        toDateTimeLocal: function() {
            this._checkDateIsSet();

            var time = this.date.getTime();
            time -= this.getTimezoneOffset();

            this.date = new Date(time);
            this.isUTC = false;

            return this;
        },

        format: function(format) {
            this._checkDateIsSet();

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

        monthsLeft: function() {
            this._checkDateIsSet();

            if (this.isUTC) {
                throw "UTC months left is still not supported";
            } else {
                var now = new Date();
                var currentMonthIndex = date.getMonth();
                var referenceMonthIndex = this.date.getMonth();

                return referenceMonthIndex - currentMonthIndex;
            }
        },

        getMonthName: function(index) {
            return this.getMonths()[index];
        },

        getMonths: function() {
            return ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        },

        convertToDate: function(year, monthIndex) {
            var date = new Date();
            date.setDate(1); // failsafe, e.g. for when current day is 31, and target month is Feb.
            date.setMonth(monthIndex);
            date.setFullYear(year);

            return date;
        },

        convertToTimestamp: function(year, monthIndex) {
            var date = this.convertToDate(monthIndex, year);
            return date.getTime();
        },

        convertToUnixTimestamp: function(year, monthIndex) {
            var unixTimestamp = this.convertToTimestamp(monthIndex, year) / 1000;
            return parseInt(unixTimestamp, 10);
        },

        convertToUnixTimestampUTC: function(year, monthIndex) {
            var unixTimestamp = this.convertToUnixTimestamp(year, monthIndex);

            return unixTimestamp + this.getTimezoneOffset();
        }
    };
};


module.exports = DateUtil;