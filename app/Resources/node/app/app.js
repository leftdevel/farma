// Requiring here in order to boot it up since it has no listeners.
var SettingsStore = require('./stores/settings-store');

var React = require('react');
var Router = require('react-router');
var routes = require('./routes');

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});

// Boot
var SettingsActions = require('./actions/settings-actions');
var UserActions = require('./actions/user-actions');

SettingsActions.ready(function() {
    UserActions.fetchUsers();
});
