'use strict';

var Input = require('../../../components/materialize/input');

var SearchBar = React.createClass({
    propTypes: {
        onUserInput: React.PropTypes.func.isRequired
    },

    _handleSearchChange () {
        this.props.onUserInput(this.refs.filterTextInput.value());
    },

    _handleSubmit () {
        return false;
    },

    render () {
        return (
            <form className="tag-search"
                  onSubmit={this._handleSubmit}>
                <Input ref="filterTextInput"
                       id="filterTextInput"
                       onChange={this._handleSearchChange}>
                    {I18n.t('js.tag.filter')}
                </Input>
            </form>
        );
    }
});

module.exports = SearchBar;
