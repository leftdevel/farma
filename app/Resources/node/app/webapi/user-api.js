var request = require('superagent');
var ApiResponseHandler = require('./api-response-handler');

var UserApi = {
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

    deleteUser: function(id, successCallback) {
        var url = Routing.generate('user_delete', {'id': id});

        request
            .del(url)
            .set('Accept', 'application/json')
            .end(function(err, res) {
                ApiResponseHandler.handle(err, res, successCallback);
            })
        ;
    },
};

module.exports = UserApi;
