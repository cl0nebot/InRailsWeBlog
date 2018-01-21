'use strict';

import {
    setSelectedTag,
    fetchSearch
} from '../../actions';

import {
    getTags,
    getSelectedTags,
    getAutocompleteTags,
    getAutocompleteArticles
} from '../../selectors';

import SearchSelectedModule from './module/selected';
import SearchTagModule from './module/tag';
import SearchArticleModule from './module/article';

@connect((state) => {
    const query = state.autocompleteState.query;
    const tags = query && query.length > 0 ? getAutocompleteTags(state) : getTags(state);

    return ({
        isSearching: state.autocompleteState.isFetching,
        query: query,
        actionKey: state.autocompleteState.actionKey,
        tags: tags,
        selectedTags: getSelectedTags(state),
        articles: getAutocompleteArticles(state)
    });
}, {
    setSelectedTag,
    fetchSearch
})
export default class SearchModule extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        // From connect
        tags: PropTypes.array,
        selectedTags: PropTypes.array,
        articles: PropTypes.array,
        isSearching: PropTypes.bool,
        query: PropTypes.string,
        actionKey: PropTypes.string,
        setSelectedTag: PropTypes.func,
        fetchSearch: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    state = {
        highlightedTagIndex: undefined
    };

    componentDidMount() {
        // Mousetrap.bind('alt+r', () => {
        //     this._toggleSearchNav();
        //     return false;
        // }, 'keydown');
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.query !== nextProps.query) {
            this._resetTagSelection();
        }

        if (nextProps.actionKey) {
            if (this._handleKeyAction()[nextProps.actionKey]) {
                this._handleKeyAction()[nextProps.actionKey].call(this, nextProps.actionKey);
            }
        }
    }

    _handleKeyAction = () => {
        return {
            ArrowDown() {
                const {highlightedTagIndex} = this.state;
                const index =
                    (highlightedTagIndex === undefined || highlightedTagIndex === this.props.tags.length - 1)
                        ? 0
                        : highlightedTagIndex + 1;

                this.setState({
                    highlightedTagIndex: index
                });
            },

            ArrowUp() {
                const {highlightedTagIndex} = this.state;
                const index =
                    (highlightedTagIndex === undefined || highlightedTagIndex === 0)
                        ? this.props.tags.length - 1
                        : highlightedTagIndex - 1;

                this.setState({
                    highlightedTagIndex: index
                });
            },

            Enter() {
                if (this.state.highlightedTagIndex !== undefined) {
                    this._handleTagSelection(this.props.tags[this.state.highlightedTagIndex]);
                } else {
                    this._performSearch();
                }
            },

            Tab() {
                this._handleTagSelection(this.props.tags[0]);
            },

            Escape() {
                // TODO: close search
                this._resetTagSelection();
            }
        }
    };

    _handleTagSelection = (tag) => {
        this.props.setSelectedTag(tag);
    };

    _resetTagSelection = () => {
        this.setState({
            highlightedTagIndex: undefined
        });
    };

    _performSearch = () => {
        this.props.fetchSearch({
            query: this.props.query,
            tags: this.props.selectedTags.map((tag) => tag.id)
        })
            .then(() => this.props.history.push('/research'));
    };

    render() {
        return (
            <div className="search-module-results">
                <div className="search-module-container">
                    {
                        this.props.selectedTags.length > 0 &&
                        <SearchSelectedModule selectedTags={this.props.selectedTags}
                                              onTagClick={this._handleTagSelection}/>
                    }

                    <SearchTagModule tags={this.props.tags}
                                     isSearching={this.props.isSearching}
                                     selectedTags={this.props.selectedTags}
                                     highlightedTagIndex={this.state.highlightedTagIndex}
                                     onTagClick={this._handleTagSelection}/>

                    <SearchArticleModule articles={this.props.articles}
                                         isSearching={this.props.isSearching}/>

                    <button className="search-module-btn"
                            onClick={this._performSearch}>
                        {I18n.t('js.search.module.button')}
                    </button>
                </div>
            </div>
        );
    }
}
