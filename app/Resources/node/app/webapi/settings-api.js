var request = require('superagent');
var ApiResponseHandler = require('./api-response-handler');

module.exports = {
    fetchSettings: function(successCallback) {
        var url = Routing.generate('app_settings');

        request
            .get(url)
            .set('Accept', 'application/json')
            .end(function(err, res) {
                ApiResponseHandler.handle(err, res, successCallback);
            })
        ;
    }
};