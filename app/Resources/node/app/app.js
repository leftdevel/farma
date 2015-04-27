var React = require('react');
var Router = require('react-router');
var routes = require('./routes');

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});

// boot
var UserActions = require('./actions/user-actions');
UserActions.boot();