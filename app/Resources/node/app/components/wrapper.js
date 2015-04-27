var React = require('react');

module.exports = React.createClass({
    render: function() {
        return (
            <div>
                <nav className="top-nav teal">
                <div className="container">
                  <div className="row">
                    <div className="nav-wrapper col offset-s1 s11"><a className="page-title">{this.props.title}</a></div>
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