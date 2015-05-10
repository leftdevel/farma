var React = require('react');
var FormFieldMixing = require('./form-field-mixin');
var Text = require('./text');
var StringUtils = require('../../../lib/string/string-utils');
var DomUtils = require('../../../lib/dom/dom-utils');

//StringUtils.createIndexable();

var Autocomplete = React.createClass({
    mixins: [
        FormFieldMixing
    ],

    propTypes: {
        options: React.PropTypes.array.isRequired,
        onChoseHandler: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            focused: false
        };
    },

    componentWillMount: function() {
        this._id = 'autocomplete-' + Date.now();
    },

    componentDidMount: function() {
        if (document) {
            document.body.addEventListener('click', this._onBodyClick);
        }
    },

    componentWillUnmount: function() {
        if (document) {
            document.body.removeEventListener('click', this._onBodyClick);
        }
    },

    _onBodyClick: function(event) {
        var currentComponent = DomUtils.closestWithId(this._id, event.target);

        if (!currentComponent) {
            this._blur();
        }
    },

    render: function() {
        return (
            <div id={this._id} className="autocomplete-container">
                <Text
                    noWrap={this.props.noWrap}
                    id={this.props.id}
                    label={this.props.label}
                    placeholder={this.props.placeholder}
                    value={this.props.value}
                    changeHandler={this.props.changeHandler}
                    error={this.props.error}
                    onFocus={this._onFocus}>

                    {this._getAutoComplete()}
                </Text>
            </div>
        );
    },

    _onFocus: function() {
        this.setState({focused: true});
    },

    _blur: function(event) {
        this.setState({focused: false});
    },

    _getAutoComplete: function() {
        if (!this.state.focused || this.props.value === '') {
            return null;
        }

        var options = this._filterOptions().map(function(option, index) {
            return (
                <li onClick={this._onChose.bind(null, option.value)} key={option.value} className="collection-item">{option.label}</li>
            );
        }.bind(this));

        if (options.length === 0) return null;

        return (
            <ul className="autocomplete collection">
                {options}
            </ul>
        );
    },

    _filterOptions: function() {
        return this.props.options.filter(function(option) {
            return StringUtils.createIndexable(option.label).indexOf(StringUtils.createIndexable(this.props.value)) !== -1;
        }.bind(this));
    },

    _onChose: function(value) {
        this.props.onChoseHandler(value);
        this._blur();
    }
});

module.exports = Autocomplete;
