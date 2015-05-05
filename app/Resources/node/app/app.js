var React = require('react');
var Router = require('react-router');
var routes = require('./routes');

var RouteActions = require('./actions/route-actions');

Router.run(routes, function (Handler, state) {
    RouteActions.change(state);
    React.render(<Handler />, document.body);
});

// Boot
var UserActions = require('./actions/user-actions');
UserActions.fetchUsers();
