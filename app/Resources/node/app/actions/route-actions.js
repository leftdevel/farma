var AppDispatcher = require('../dispatcher/app-dispatcher');
var RouteConstants = require('../constants/route-constants');

var RouteActions = {
    change: function(routing) {
        AppDispatcher.dispatch({
            actionType: RouteConstants.ROUTE_CHANGE,
            routing: routing
        });
    }
};

module.exports = RouteActions;