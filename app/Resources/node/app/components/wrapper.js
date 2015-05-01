var React = require('react');

var SettingsUtils = require('../utils/settings-utils');
var settings = SettingsUtils.getSettings();
var user = settings.user;

var Wrapper = React.createClass({
    render: function() {
        return (
            <div>
                <nav className="top-nav  light-blue darken-3">
                <div className="container">
                  <div className="row">
                    <div className="nav-wrapper col offset-s1 s11">

                      <span className="page-title">{this.props.title}</span>
                      <span className="float right">{user.full_name} | <a href={settings.logout_url}>Salir</a></span>
                    </div>
                  </div>
                </div>
              </nav>
              <div className="section" id="index-banner">
                <div className="container">
                  <div className="row">
                    <div className="col offset-s1 s11">
                      {this.props.children}
                    </div>
                  </div>
                </div>
              </div>
            </div>
        );
    }
});

module.exports = Wrapper;