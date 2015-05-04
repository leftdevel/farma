var React = require('react');
var Router = require('react-router');
var routes = require('./routes');

Router.run(routes, function (Handler, state) {
  React.render(<Handler queryParams={state.params} />, document.body);
});

// Boot
var UserActions = require('./actions/user-actions');
UserActions.fetchUsers();
