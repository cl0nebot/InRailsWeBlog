'use strict';

const classNames = require('classnames');

// determines the min query length for which
// suggestions are displayed
const MIN_QUERY_LENGTH = 1;

var Suggestions = React.createClass({
    displayName: 'Suggestions',

    propTypes: {
        query: React.PropTypes.string.isRequired,
        labelField: React.PropTypes.string,
        selectedIndex: React.PropTypes.number.isRequired,
        tags: React.PropTypes.array.isRequired,
        onClickSuggestion: React.PropTypes.func.isRequired,
        handleHover: React.PropTypes.func.isRequired
    },

    markIt (input, query) {
        var escapedRegex = query.trim().replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
        var r = new RegExp(escapedRegex, "gi");
        return {
            __html: input.replace(r, "<mark>$&</mark>")
        };
    },

    render () {
        var suggestions = this.props.tags.map(( (item, i) => {
            var itemName = this.props.labelField ? item[this.props.labelField] : item;
            var SuggestionClass = classNames(
                {
                    'active': i == this.props.selectedIndex
                }
            );
            return (
                <li key={i}
                    onClick={this.props.onClickSuggestion.bind(null, i)}
                    onMouseOver={this.props.handleHover.bind(null, i)}
                    className={SuggestionClass}>
                    <span dangerouslySetInnerHTML={this.markIt(itemName, this.props.query)} />
                </li>
            )
        }));

        if (suggestions.length === 0 || this.props.query.length < MIN_QUERY_LENGTH) {
            return <div className="tagsinput-suggestions"> </div>
        }

        return (
            <div className="tagsinput-suggestions">
                <ul> { suggestions } </ul>
            </div>
        );
    }
});

module.exports = Suggestions;
