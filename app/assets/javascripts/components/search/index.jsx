'use strict';

import {
    hot
} from 'react-hot-loader';

import {
    withStyles
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Chip from '@material-ui/core/Chip';

import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';

import {
    getSearchContext,
    searchOnHistoryChange,
    setSelectedTag,
    fetchSearch,
    filterSearch,
    updateUserSettings
} from '../../actions';

import {
    getSearchMetaTags,
    getSelectedTags,
    getArticleSuggestions,
    getTagSuggestions,
    getSearchTags,
    getSearchArticles
} from '../../selectors';

import HeadLayout from '../layouts/head';

import EnsureValidity from '../modules/ensureValidity';

import Loader from '../theme/loader';

import SearchSuggestionIndex from './index/suggestion';
import SearchTagIndex from './index/tag';
import SearchArticleIndex from './index/article';

import styles from '../../../jss/search/index';
export default @connect((state) => ({
    metaTags: getSearchMetaTags(state),
    currentUserId: state.userState.currentId,
    currentUser: state.userState.user,
    searchDisplay: state.userState.user && state.userState.user.settings.searchDisplay,
    query: state.searchState.query,
    selectedTags: getSelectedTags(state),
    hasResults: state.searchState.hasResults,
    tags: getSearchTags(state),
    tagSuggestions: getTagSuggestions(state),
    articles: getSearchArticles(state),
    articleSuggestions: getArticleSuggestions(state),
}), {
    getSearchContext,
    searchOnHistoryChange,
    setSelectedTag,
    fetchSearch,
    filterSearch,
    updateUserSettings
})
@hot(module)
@withStyles(styles)
class SearchIndex extends React.Component {
    static propTypes = {
        // from connect
        metaTags: PropTypes.object,
        currentUserId: PropTypes.number,
        currentUser: PropTypes.object,
        searchDisplay: PropTypes.string,
        query: PropTypes.string,
        selectedTags: PropTypes.array,
        hasResults: PropTypes.bool,
        tags: PropTypes.array,
        tagSuggestions: PropTypes.array,
        articles: PropTypes.array,
        articleSuggestions: PropTypes.array,
        getSearchContext: PropTypes.func,
        searchOnHistoryChange: PropTypes.func,
        setSelectedTag: PropTypes.func,
        fetchSearch: PropTypes.func,
        filterSearch: PropTypes.func,
        updateUserSettings: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this._request = null;
    }

    state = {
        previousQuery: null,
        query: this.props.query || '',
        highlightedTagId: null
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.previousQuery !== nextProps.query) {
            return {
                previousQuery: nextProps.query || '',
                query: nextProps.query || ''
            };
        }

        return null;
    }

    componentDidMount() {
        // Retrieve search from url or history
        this.props.getSearchContext();

        // Save search in browser history
        this.props.searchOnHistoryChange();
    }

    componentWillUnmount() {
        if (this._request && this._request.signal) {
            this._request.signal.abort();
        }
    }

    _handleKeyDown = (event) => {
        if (event.key && Utils.NAVIGATION_KEYMAP[event.which]) {
            if (this.state.query.length > 0) {
                if (Utils.NAVIGATION_KEYMAP[event.which] === 'enter') {
                    this._handleSubmit(event);
                } else if (Utils.NAVIGATION_KEYMAP[event.which] === 'tab') {
                    event.preventDefault();

                    if (this.props.tags.length > 0) {
                        const tagIndex = this.state.highlightedTagId ? this.props.tags.findIndex((tag) => tag.id === this.state.highlightedTagId) : 0;

                        this.props.setSelectedTag(this.props.tags[tagIndex]);

                        this.setState({
                            highlightedTagId: null,
                            query: ''
                        });
                    }
                } else if (Utils.NAVIGATION_KEYMAP[event.which] === 'up') {
                    let newTagId;
                    if (!this.state.highlightedTagId || this.state.highlightedTagId === this.props.tags.first().id) {
                        newTagId = this.props.tags[this.props.tags.length - 1].id;
                    } else {
                        newTagId = this.props.tags[this.props.tags.findIndex((tag) => tag.id === this.state.highlightedTagId) - 1].id;
                    }

                    this.setState({
                        highlightedTagId: newTagId
                    });
                } else if (Utils.NAVIGATION_KEYMAP[event.which] === 'down') {
                    let newTagId;
                    if (!this.state.highlightedTagId || this.state.highlightedTagId === this.props.tags[this.props.tags.length - 1].id) {
                        newTagId = this.props.tags[0].id;
                    } else {
                        newTagId = this.props.tags[this.props.tags.findIndex((tag) => tag.id === this.state.highlightedTagId) + 1].id;
                    }

                    this.setState({
                        highlightedTagId: newTagId
                    });
                }
            } else if (this.state.query.length === 0 && this.props.selectedTags.length > 0) {
                if (Utils.NAVIGATION_KEYMAP[event.which] === 'backspace') {
                    event.preventDefault();

                    this.props.setSelectedTag(this.props.selectedTags[this.props.selectedTags.length - 1]);
                }
            }
        }
    };

    _handleChange = (event) => {
        const query = event.target.value;

        this.setState({
            query
        });
    };

    _handleSuggestionClick = (suggestion) => {
        this._performSearch(suggestion);
    };

    _handleTagSelection = (tag) => {
        this.props.setSelectedTag(tag);

        this.setState({
            query: ''
        });
    };

    _handleSubmit = (event) => {
        event.preventDefault();

        this._performSearch(this.state.query);
    };

    _handleOrderChange = (order) => {
        let orders = {};

        if (order === 'priority') {
            orders.order = 'priority_desc';
        } else if (order === 'date') {
            orders.order = 'updated_desc';
        }

        this.props.filterSearch(orders);
    };

    _handleDisplayChange = (display) => {
        if (this.props.currentUserId) {
            this.props.updateUserSettings(this.props.currentUserId, {
                searchDisplay: display
            });
        }
    };

    _performSearch = (query) => {
        this._request = this.props.fetchSearch({
            query: query,
            tags: this.props.selectedTags.map((tag) => tag.slug)
        });
    };

    render() {
        if (this.props.currentUserId && !this.props.currentUser) {
            return (
                <div className={this.props.classes.root}>
                    <div className="center">
                        <Loader size="big"/>
                    </div>
                </div>
            );
        }

        const hasNoResults = (this.props.query && this.props.query.length > 0) && !this.props.hasResults;

        return (
            <div className={this.props.classes.root}>
                <HeadLayout metaTags={this.props.metaTags}/>

                <form onSubmit={this._handleSubmit}>
                    <EnsureValidity/>

                    <Grid container={true}
                          spacing={32}
                          direction="row"
                          justify="center"
                          alignItems="center">
                        <Grid item={true}
                              className={this.props.classes.inputItem}>
                            <FormControl classes={{
                                root: this.props.classes.inputForm
                            }}>
                                <div className={this.props.classes.searchIcon}>
                                    <SearchIcon fontSize="large"/>
                                </div>

                                <Input name="search"
                                       type="search"
                                       classes={{
                                           root: this.props.classes.inputRoot,
                                           input: this.props.classes.inputSearch
                                       }}
                                       autoFocus={true}
                                       placeholder={I18n.t('js.search.index.placeholder')}
                                       value={this.state.query}
                                       startAdornment={
                                           <InputAdornment position="start">
                                               {
                                                   this.props.selectedTags.map((tag) => (
                                                       <Chip key={tag.id}
                                                             className={this.props.classes.inputTag}
                                                             tabIndex={-1}
                                                             label={tag.name}
                                                             color="primary"
                                                             variant="outlined"
                                                             deleteIcon={<CancelIcon/>}
                                                             onClick={this._handleTagSelection.bind(this, tag)}
                                                             onDelete={this._handleTagSelection.bind(this, tag)}/>
                                                   ))
                                               }
                                           </InputAdornment>
                                       }
                                       onKeyDown={this._handleKeyDown}
                                       onChange={this._handleChange}
                                       onSubmit={this._handleSubmit}/>
                            </FormControl>
                        </Grid>

                        <Grid item={true}>
                            <Button color="primary"
                                    variant="outlined"
                                    onClick={this._handleSubmit}>
                                {I18n.t('js.search.index.button')}
                            </Button>
                        </Grid>
                    </Grid>
                </form>

                <SearchSuggestionIndex classes={this.props.classes}
                                       articleSuggestions={this.props.articleSuggestions}
                                       tagSuggestions={this.props.tagSuggestions}
                                       onSuggestionClick={this._handleSuggestionClick}/>

                {
                    hasNoResults &&
                    <div className={classNames(this.props.classes.helpMessage)}>
                        {I18n.t('js.search.index.no_results')}
                    </div>
                }

                {
                    this.props.tags.length > 0 &&
                    <SearchTagIndex classes={this.props.classes}
                                    tags={this.props.tags}
                                    highlightedTagId={this.state.highlightedTagId}
                                    onTagClick={this._handleTagSelection}/>
                }

                {
                    this.props.articles.length > 0 &&
                    <SearchArticleIndex classes={this.props.classes}
                                        articles={this.props.articles}
                                        searchDisplay={this.props.searchDisplay}
                                        onOrderChange={this._handleOrderChange}
                                        onDisplayChange={this._handleDisplayChange}/>
                }
            </div>
        );
    }
}
