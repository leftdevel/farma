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

        month = month.toString().length === 1 ? '0' + month.toString() : month;
        day = day.toString().length === 1 ? '0' + day.toString() : day;
        hours = hours.toString().length === 1 ? '0' + hours.toString() : hours;
        minutes = minutes.toString().length === 1 ? '0' + minutes.toString() : minutes;
        seconds = seconds.toString().length === 1 ? '0' + seconds.toString() : seconds;

        format = format.replace(/Y/g, year);
        format = format.replace(/m/g, month);
        format = format.replace(/d/g, day);
        format = format.replace(/H/g, hours);
        format = format.replace(/i/g, minutes);
        format = format.replace(/s/g, seconds);

        return format;
    }
};

module.exports = DateUtil;