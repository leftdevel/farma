var request = require('superagent');

function handleResponse(err, res, successCallback) {
    if (err) {
        alert('ERROR!!!!!');
        console.log(err);
        return;
    }

    successCallback(JSON.parse(res.text));
}

module.exports = {
    fetchUsers: function(successCallback) {
        var url = Routing.generate('user_list');

        request
            .get(url)
            .set('Accept', 'application/json')
            .end(function(err, res) {
                handleResponse(err, res, successCallback);
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
                handleResponse(err, res, successCallback);
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
                handleResponse(err, res, successCallback);
            })
        ;
    }
};