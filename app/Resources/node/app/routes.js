var React = require('react');
var Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Route = Router.Route;

var Header = require('./components/header');
var Modal = require('./components/modal');

var Users = require('./components/users/list');
var UserCreate = require('./components/users/create');
var UserEdit = require('./components/users/edit');

var App = React.createClass({
  render: function () {
    return (
      <div>
        <Header />
        <main id="content">
          <RouteHandler />
        </main>
        <Modal />
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="users" path="users" handler={Users} />
    <Route name="users-create" path="users/create" handler={UserCreate} />
    <Route name="users-edit" path="users/edit/:userId" handler={UserEdit} />
    <DefaultRoute handler={Users}/>
  </Route>
);

module.exports = routes;