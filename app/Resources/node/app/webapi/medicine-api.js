var request = require('superagent');
var ApiResponseHandler = require('./api-response-handler');

var MedicineApi = {
    fetchMedicines: function(successCallback) {
        var url = Routing.generate('medicine_list');

        request
            .get(url)
            .set('Accept', 'application/json')
            .end(function(err, res) {
                ApiResponseHandler.handle(err, res, successCallback);
            })
        ;
    },

    createMedicine: function(entity, successCallback) {
        var url = Routing.generate('medicine_create');

        request
            .post(url)
            .send(entity)
            .set('Accept', 'application/json')
            .end(function(err, res) {
                ApiResponseHandler.handle(err, res, successCallback);
            })
        ;
    }
};

module.exports = MedicineApi;