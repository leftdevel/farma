var React = require('react');
var Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
var Route = Router.Route;

var Users = require('./components/users.js');

var App = React.createClass({
  render: function () {
    return (
      <div>

        <header>
          <nav className="top-nav teal">
            <div className="container">
              <div className="row">
                <div className="nav-wrapper col offset-s1 s11"><a className="page-title">Mi Farmacita</a></div>
              </div>
            </div>
          </nav>

          <ul id="nav-mobile" className="side-nav fixed">
            <li className="logo">
              <a id="logo-container" href="#" className="rand-logo">
                <object height="30px" id="front-page-logo" type="image/svg+xml" data="/bundles/farmaapp/images/materialize.svg">Your browser does not support SVG</object>
              </a>
            </li>
            <li className="bold"><Link to="users" className="waves-effect waves-teal">Usuarios</Link></li>
          </ul>
        </header>

        <main>
          <div className="section" id="index-banner">
            <div className="container">
              <div className="row">
                <div className="col offset-s1 s11">
                  <RouteHandler/>
                </div>
              </div>
            </div>
          </div>
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