var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var ToastStore = require('../stores/toast-store');
var ToastActions = require('../actions/toast-actions');

function getState() {
    return {
        toasts: ToastStore.getToastsIterator()
    };
}

var Toast = React.createClass({
    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        ToastStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ToastStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(getState());
    },

    render: function() {
        if (!this.state.toasts.length) {
            return null;
        }

        var toastList = this.state.toasts.map(function(el) {
            return (
                <div key={el._id} className="toast rounded">
                    {el.toast}
                </div>
            );
        });

        return (
            <div id="toast-container">
                <ReactCSSTransitionGroup transitionName="toast" transitionAppear={true}>
                    {toastList}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
});

module.exports = Toast;
