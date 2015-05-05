var React = require('react');
var RouteStore = require('../stores/route-store');
var Progress = require('./progress');
var Router = require('react-router');
var Link = Router.Link;

function getState() {
    return {
        routing: RouteStore.getRouting()
    };
}

var Header = React.createClass({
    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        RouteStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        RouteStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(getState());
    },

    render: function() {
        return (
            <header>
              <ul id="nav-mobile" className="side-nav fixed">
                <li className="logo">
                  <a id="logo-container" href="#" className="rand-logo">
                    <object height="30px" id="front-page-logo" type="image/svg+xml" data="/bundles/farmaapp/images/materialize.svg">Your browser does not support SVG</object>
                  </a>
                  <Progress />
                </li>
                <li className={ this._isUsersRoute() ?  "bold active" : "bold"}><Link to="users">Usuarios</Link></li>
              </ul>
            </header>
        );
    },

    _isUsersRoute: function() {
        return this.state.routing.path.indexOf('/users') !== -1;
    }
});

module.exports = Header;