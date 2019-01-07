'use strict';

import {
    hot
} from 'react-hot-loader';

import {
    withStyles
} from '@material-ui/core/styles';

import {
    fetchArticles,
    updateArticleOrder,
    setCurrentArticles,
    setCurrentTags
} from '../../actions';

import {
    getArticleMetaTags,
    getArticlePagination,
    getArticles
} from '../../selectors';

import Loader from '../theme/loader';

import HeadLayout from '../layouts/head';

import ArticleListDisplay from './display/list';
import ArticleNoneDisplay from '../articles/display/none';

import styles from '../../../jss/article/index';

export default @hot(module)

@connect((state) => ({
    metaTags: getArticleMetaTags(state),
    userId: state.userState.currentId,
    userSlug: state.userState.currentSlug,
    currentUserTopicId: state.topicState.currentUserTopicId,
    isFetching: state.articleState.isFetching,
    articles: getArticles(state),
    articlePagination: getArticlePagination(state),
    articlesLoaderMode: state.uiState.articlesLoaderMode,
    articleDisplayMode: state.uiState.articleDisplayMode,
    articleOrderMode: state.uiState.articleOrderMode,
    areArticlesMinimized: state.uiState.areArticlesMinimized,
    articleEditionId: state.articleState.articleEditionId
}), {
    fetchArticles,
    updateArticleOrder,
    setCurrentArticles,
    setCurrentTags
})
@withStyles(styles)
class ArticleIndex extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        queryString: PropTypes.string,
        // from connect
        metaTags: PropTypes.object,
        userId: PropTypes.number,
        userSlug: PropTypes.string,
        currentUserTopicId: PropTypes.number,
        isFetching: PropTypes.bool,
        articles: PropTypes.array,
        articlePagination: PropTypes.object,
        articleEditionId: PropTypes.number,
        articlesLoaderMode: PropTypes.string,
        articleDisplayMode: PropTypes.string,
        articleOrderMode: PropTypes.string,
        areArticlesMinimized: PropTypes.bool,
        fetchArticles: PropTypes.func,
        updateArticleOrder: PropTypes.func,
        setCurrentArticles: PropTypes.func,
        setCurrentTags: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this._parseQuery = Utils.parseUrlParameters(props.queryString) || {};
        this._request = null;
    }

    componentDidMount() {
        this._fetchArticles(this.props.params);

        if (this.props.params.tagSlug) {
            this.props.setCurrentTags([{slug: this.props.params.tagSlug}, {slug: this.props.params.childTagSlug}])
        }
    }

    componentDidUpdate(prevProps) {
        // Manage articles order or sort
        if (!Object.equals(this.props.params, prevProps.params) || this.props.queryString !== prevProps.queryString) {
            const nextParseQuery = Utils.parseUrlParameters(this.props.queryString) || {};

            if (this._parseQuery.order !== nextParseQuery.order) {
                if (nextParseQuery.order) {
                    this.props.updateArticleOrder(nextParseQuery.order);
                }
            }

            this._parseQuery = nextParseQuery;

            this._fetchArticles(this.props.params);

            if (this.props.params.tagSlug) {
                this.props.setCurrentTags([{slug: this.props.params.tagSlug}, {slug: this.props.params.childTagSlug}]);
            }
        }
    }

    componentWillUnmount() {
        if (this._request && this._request.signal) {
            this._request.signal.abort();
        }
    }

    _fetchArticles = (params) => {
        let options = {};
        if (this.props.articlesLoaderMode === 'all') {
            options.limit = 1000;
        }

        if (params.childTagSlug) {
            params.parentTagSlug = params.tagSlug;
            delete params.tagSlug;
        }

        this._request = this.props.fetchArticles({
            userId: this.props.userId,
            ...params,
            ...this._parseQuery
        }, options);
    };

    _fetchNextArticles = (params = {}) => {
        if (this.props.articlePagination && this.props.articlePagination.currentPage <= this.props.articlePagination.totalPages) {
            const queryParams = Utils.parseUrlParameters(this.props.queryString);
            const options = {
                page: (params.selected || this.props.articlePagination.currentPage) + 1
            };

            this._request = this.props.fetchArticles({
                userId: this.props.userId,
                topicId: this.props.currentUserTopicId,
                ...queryParams
            }, options, {infinite: !params.selected});

            this._request.fetch.then(() => {
                if (params.selected) {
                    setTimeout(() => {
                        if (ReactDOM.findDOMNode(this)) {
                            $('html, body').animate({scrollTop: ReactDOM.findDOMNode(this).getBoundingClientRect().top - 64}, 750);
                        }
                    }, 300);
                }
            });
        }
    };

    _handleArticleEnter = (article) => {
        this.props.setCurrentArticles('add', article.id);
    };

    _handleArticleExit = (article) => {
        this.props.setCurrentArticles('remove', article.id);
    };

    render() {
        const hasMoreArticles = this.props.articlePagination && this.props.articlePagination.currentPage < this.props.articlePagination.totalPages;
        const isSortedByTag = this.props.articleOrderMode === 'tag_asc' || this.props.articleOrderMode === 'tag_desc';

        if (this.props.articles.length === 0 && !this.props.isFetching) {
            return (
                <div className="blog-article-box">
                    <ArticleNoneDisplay userSlug={this.props.params.userSlug}
                                        topicSlug={this.props.params.topicSlug}
                                        tagSlug={this.props.params.tagSlug}
                                        childTagSlug={this.props.params.childTagSlug}
                                        isTopicPage={true}
                                        isSearchPage={false}/>
                </div>
            );
        }

        return (
            <div className={classNames(this.props.classes.root, {
                [this.props.classes.grid]: this.props.articleDisplayMode === 'grid'
            })}>
                <HeadLayout metaTags={this.props.metaTags}/>

                {
                    this.props.isFetching &&
                    <div className={this.props.classes.root}>
                        <div className="center">
                            <Loader size="big"/>
                        </div>
                    </div>
                }

                {
                    this.props.articles.length > 0 &&
                    <ArticleListDisplay articles={this.props.articles}
                                        articlesLoaderMode={this.props.articlesLoaderMode}
                                        articleDisplayMode={this.props.articleDisplayMode}
                                        articleEditionId={this.props.articleEditionId}
                                        hasMoreArticles={hasMoreArticles}
                                        isSortedByTag={isSortedByTag}
                                        isMinimized={this.props.areArticlesMinimized}
                                        parentTag={this.props.params.tagSlug}
                                        articleTotalPages={this.props.articlePagination && this.props.articlePagination.totalPages}
                                        onEnter={this._handleArticleEnter}
                                        onExit={this._handleArticleExit}
                                        fetchArticles={this._fetchNextArticles}/>
                }
            </div>
        );
    }
}
