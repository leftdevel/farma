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

    createUser: function(data, successCallback) {
        var url = Routing.generate('user_create');

        request
            .post(url)
            .send(data)
            .set('Accept', 'application/json')
            .end(function(err, res) {
                handleResponse(err, res, successCallback);
            })
        ;
    }
};