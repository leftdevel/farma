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

    render: function() {
        var children = [];
        var filteredItems = this._filter(this.state.normalizedSearchTerm);

        React.Children.forEach(this.props.children, function(child, index) {
            var props = child.props;
            props.filteredItems = filteredItems;
            var ClonedChild = React.cloneElement(child, props);
            children.push(ClonedChild);
        });

        return (
            <div>
                <Text id="search" label={this.props.title || 'Search'} changeHandler={this._onChange} value={this.state.searchTerm} placeholder={this.props.placeholder || 'Enter a term'} />
                {children}
            </div>
        );
    },

    _onChange: function(id, value) {
        var searchTerm = value;
        var normalizedSearchTerm = StringUtils.createIndexable(searchTerm);
        this.setState({searchTerm: searchTerm, normalizedSearchTerm: normalizedSearchTerm});
    },

    _filter: function(normalizedSearchTerm) {
        if (!normalizedSearchTerm) {
            return this.props.items;
        }

        var searchableProperties = this.props.searchableProperties;

        var filteredItems = this.props.items.filter(function(item) {
            var match = false;

            for (var i in searchableProperties) {
                var prop = searchableProperties[i];

                if (item[prop].indexOf(normalizedSearchTerm) >= 0) {
                    return true;
                }
            }

            return false;


        }.bind(this));

        return filteredItems;
    }
});

module.exports = SmartTable;