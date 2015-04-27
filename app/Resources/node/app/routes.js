var React = require('react');
var Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
var Route = Router.Route;

var Progress = require('./components/progress.js');
var Users = require('./components/users.js');

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
            <li className="bold"><Link to="users" className="waves-effect waves-teal">Usuarios</Link></li>
          </ul>
        </header>

        <main>
          <RouteHandler />
        </main>

      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="users" handler={Users}/>
    <DefaultRoute handler={Users}/>
  </Route>
);

module.exports = routes;