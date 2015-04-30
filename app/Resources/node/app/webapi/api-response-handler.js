// @TODO import AlertActions or something to alert for errors

module.exports = {
    handle: function(err, res, successCallback) {
        if (err) {
            alert('ERROR!!!!!');
            console.log(err);
            return;
        }

        successCallback(JSON.parse(res.text));
    }
};