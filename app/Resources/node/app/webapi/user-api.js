var request = require('superagent');

module.exports = {
    getUsers: function(successCallback) {
        var url = Routing.generate('user_list');

        request
           .get(url)
           .end(function(err, res){
                if (err) {
                    alert('ERROR!!!!!');
                    console.log(err);
                    return;
                }

                successCallback(res.text);
            })
        ;
    }
};