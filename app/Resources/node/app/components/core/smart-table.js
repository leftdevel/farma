var React = require('react');

var SmartTable = React.createClass({
    propTypes: {
        items: React.PropTypes.array.isRequired,
        searchableProperties: React.PropTypes.array.isRequired,
        placeholder: React.PropTypes.string,
        searchTermNormalizer: React.PropTypes.func,
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
                {this.props.title || 'Search'}
                <input onChange={this._onChange} value={this.state.searchTerm} placeholder={this.props.placeholder || 'Enter a term'} />
                {children}
            </div>
        );
    },

    _onChange: function(event) {
        var searchTerm = event.target.value;
        var normalizedSearchTerm = this.props.searchTermNormalizer ? this.props.searchTermNormalizer(searchTerm) : searchTerm;
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