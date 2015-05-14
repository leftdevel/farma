var React = require('react');
var FormFieldMixing = require('./form-field-mixin');
var Text = require('./text');
var StringUtils = require('../../../lib/string/string-utils');
var DomUtils = require('../../../lib/dom/dom-utils');
var KeyboardUtils = require('../../../lib/keyboard/keyboard-utils');
var cx = require('class-set');

var Autocomplete = React.createClass({
    mixins: [
        FormFieldMixing
    ],

    propTypes: {
        options: React.PropTypes.array.isRequired,
        valuePropertyPath: React.PropTypes.string.isRequired,
        labelPropertyPath: React.PropTypes.string.isRequired,
        onChoseHandler: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            focused: false,
            hovered: 0,
        };
    },

    componentWillMount: function() {
        this._id = 'autocomplete-' + Date.now();
    },

    componentDidMount: function() {
        this._filteredOptionsLength = 0;
        if (!document) return;
        document.body.addEventListener('click', this._onBodyClick);
    },

    componentWillUnmount: function() {
        if (!document) return;
        document.body.removeEventListener('click', this._onBodyClick);
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
                    changeHandler={this._changeHandler}
                    error={this.props.error}
                    onFocus={this._onFocus}
                    onKeyDown={this._onKeyDown}>

                    {this._getAutoCompleteList()}
                </Text>
            </div>
        );
    },

    _changeHandler: function(propertyPath, value) {
        this.props.changeHandler(propertyPath, value);
        this.setState({hovered: 0});
    },

    _onFocus: function() {
        this.setState({focused: true});
    },

    _onKeyDown: function(event) {
        switch (event.which) {
            case KeyboardUtils.KEY.UP:
                event.preventDefault();
                this._hoverUp();
                break;

            case KeyboardUtils.KEY.DOWN:
                event.preventDefault();
                this._hoverDown();
                break;

            case KeyboardUtils.KEY.ENTER:
                event.preventDefault();
                this._choseHoveredOption();
                break;

            case KeyboardUtils.KEY.TAB:
                this._blur();
                break;

            default:
                // no pop
        }
    },

    _hoverUp: function() {
        var hovered = this.state.hovered;
        hovered > 0 && this.setState({hovered: --hovered});
    },

    _hoverDown: function() {
        var hovered = this.state.hovered;
        (this._filteredOptionsLength -1) > hovered && this.setState({hovered: ++hovered})
    },

    _choseHoveredOption: function() {
        if (this._filteredOptionsLength == 0) return;

        var options = this._filterOptions();
        var hoveredOption = options[this.state.hovered];
        var value = hoveredOption[this.props.valuePropertyPath];
        this.setState({hovered: 0}); // reset
        this.props.onChoseHandler(value);
    },

    _blur: function(event) {
        this.setState({focused: false});
    },


    // @TODO handle onMouseEnter
    _getAutoCompleteList: function() {
        if (!this.state.focused || this.props.value === '') {
            return null;
        }

        var filteredOptions = this._filterOptions();
        this._filteredOptionsLength = filteredOptions.length; // cache

        var optionsEl = filteredOptions.map(function(option, index) {
            var classNames = cx({
                'collection-item': true,
                'hover': this.state.hovered === index
            });

            return (
                <li
                    className={classNames}
                    onClick={this._choose.bind(null, option[this.props.valuePropertyPath])}
                    key={option[this.props.valuePropertyPath]}>

                    {option[this.props.labelPropertyPath]}
                </li>
            );
        }.bind(this));

        if (optionsEl.length === 0) return null;

        return (
            <ul className="autocomplete collection">
                {optionsEl}
            </ul>
        );
    },

    _filterOptions: function() {
        var uniqueOptions = {};
        var normalizedValue = StringUtils.createIndexable(this.props.value);

        var matchingOptions = this.props.options.filter(function(option) {
            var normalizedLabel = StringUtils.createIndexable(option[this.props.labelPropertyPath]);
            var matches = normalizedLabel.indexOf(normalizedValue) !== -1;

            if (matches) {
                uniqueOptions[normalizedLabel] = option;
            }

            return matches;

        }.bind(this));

        var compressedResult = [];

        for (var i in uniqueOptions) {
            var option = uniqueOptions[i];
            compressedResult.push(option);
        }

        return compressedResult;
    },

    _choose: function(value) {
        this.props.onChoseHandler(value);
        this._blur();
    }
});

module.exports = Autocomplete;
