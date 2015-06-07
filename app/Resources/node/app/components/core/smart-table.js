var React = require('react');
var Text = require('./form/text');
var StringUtils = require('../../lib/string/string-utils');

// Notice. Should also apply StringUtils::createIndexable to the items property values (table columns).
// Not doing in order to preserve good performance. Items are expected to have normalized column values.
// @See e.g. Medicine.php.

var SmartTable = React.createClass({
    propTypes: {
        items: React.PropTypes.array.isRequired,
        searchableProperties: React.PropTypes.array.isRequired,
        placeholder: React.PropTypes.string,
        title: React.PropTypes.string
    },

    getInitialState: function() {
        var items = this.props.items;
        return {
            searchTerm: null,
            normalizedSearchTerm: null,
        };
    },

    componentDidUpdate: function(prevProps, prevState) {
        if (this.state.normalizedSearchTerm !== prevState.normalizedSearchTerm) {
            this._filterDelayed();
        }
    },

    _filterDelayed: function() {
        if (this._timerId) {
            clearTimeout(this._timerId);
        }

        this._timerId = setTimeout(function() {
            this._filter();
            this.forceUpdate();
        }.bind(this), 200);
    },

    render: function() {
        var children = [];
        var items = this._filteredItems || this.props.items;

        React.Children.forEach(this.props.children, function(child, index) {
            var props = child.props;
            props.filteredItems = items;
            var ClonedChild = React.cloneElement(child, props);
            children.push(ClonedChild);
        }.bind(this));

        return (
            <div>
                <Text id='search' label={this.props.title || 'Search'} changeHandler={this._onChange} value={this.state.searchTerm} placeholder={this.props.placeholder || 'Enter a term'} />
                {children}
            </div>
        );
    },

    _onChange: function(id, value) {
        var searchTerm = value;
        var normalizedSearchTerm = StringUtils.createIndexable(searchTerm);
        this.setState({searchTerm: searchTerm, normalizedSearchTerm: normalizedSearchTerm});
    },

    _filter: function() {
        if (this.state.normalizedSearchTerm === '') {
            this._filteredItems = this.props.items;
            return;
        }

        var searchableProperties = this.props.searchableProperties;
        var filteredItems = this.props.items.filter(function(item) {
            var match = false;

            for (var i in searchableProperties) {
                var prop = searchableProperties[i];

                if (item[prop].indexOf(this.state.normalizedSearchTerm) >= 0) {
                    return true;
                }
            }

            return false;


        }.bind(this));

        this._filteredItems = filteredItems;
    }
});

module.exports = SmartTable;
