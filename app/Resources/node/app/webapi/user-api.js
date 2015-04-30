var request = require('superagent');
var ApiResponseHandler = require('./api-response-handler');

module.exports = {
    fetchUsers: function(successCallback) {
        var url = Routing.generate('user_list');

        request
            .get(url)
            .set('Accept', 'application/json')
            .end(function(err, res) {
                ApiResponseHandler.handle(err, res, successCallback);
            })
        ;
    },

    createUser: function(entity, successCallback) {
        var url = Routing.generate('user_create');

        request
            .post(url)
            .send(entity)
            .set('Accept', 'application/json')
            .end(function(err, res) {
                ApiResponseHandler.handle(err, res, successCallback);
            })
        ;
    },

    updateUser: function(entity, successCallback) {
        var url = Routing.generate('user_update', {id: entity.id});

        request
            .put(url)
            .send(entity)
            .set('Accept', 'application/json')
            .end(function(err, res) {
                ApiResponseHandler.handle(err, res, successCallback);
            })
        ;
    },

    findOneByEmail: function(email, successCallback) {
        var url = Routing.generate('user_find', {email: email});

        request
            .get(url)
            .set('Accept', 'application/json')
            .end(function(err, res) {
                ApiResponseHandler.handle(err, res, successCallback);
            });
    }
};