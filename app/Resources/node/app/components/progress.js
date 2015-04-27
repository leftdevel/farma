var React = require('react');
var ProgressStore = require('../stores/progress-store');
var cx = require('class-set');

function getState() {
    return {
        isWorking: ProgressStore.isWorking()
    };
}

module.exports = React.createClass({
    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        ProgressStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ProgressStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(getState);
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return this.state.isWorking !== nextState.isWorking;
    },

    render: function() {
        var classNames = cx({
            'progress': true,
            'hide': !this.state.isWorking
        });

        return (
            <div className={classNames}>
                <div className="indeterminate"></div>
            </div>
        );
    }
});