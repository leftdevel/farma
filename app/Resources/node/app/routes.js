var React = require('react');
var Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
var Route = Router.Route;

var Progress = require('./components/progress');
// var Users = require('./components/users');
var Modal = require('./components/modal');


var Users = require('./components/users/list');
var UserCreate = require('./components/users/create');

var App = React.createClass({
  render: function () {
    return (
      <div>

        <header>
          <ul id="nav-mobile" className="side-nav fixed">
            <li className="logo">
              <a id="logo-container" href="#" className="rand-logo">
                <object height="30px" id="front-page-logo" type="image/svg+xml" data="/bundles/farmaapp/images/materialize.svg">Your browser does not support SVG</object>
              </a>
              <Progress />
            </li>
            <li className="bold"><Link to="users">Usuarios</Link></li>
          </ul>
        </header>

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
    <DefaultRoute handler={Users}/>
  </Route>
);

module.exports = routes;