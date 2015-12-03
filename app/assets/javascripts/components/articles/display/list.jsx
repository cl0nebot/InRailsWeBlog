'use strict';

var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var classNames = require('classnames');
var InfiniteScroll = require('../../../components/materialize/infiniteScroll');

var ArticleActions = require('../../../actions/articleActions');
var ArticleItem = require('../item');

var ArticleListDisplay = React.createClass({
    propTypes: {
        articles: React.PropTypes.array.isRequired,
        hasMore: React.PropTypes.bool.isRequired,
        articleDisplayMode: React.PropTypes.string.isRequired,
        highlightResults: React.PropTypes.bool,
        currentUserId: React.PropTypes.number
    },

    getDefaultProps () {
        return {
            currentUserId: null,
            highlightResults: false
        };
    },

    _loadNextArticles () {
        if (this.props.hasMore) {
            ArticleActions.loadNextArticles();
        }
    },

    _renderArticles () {
        let ArticleNodes = this.props.articles.map((article) => {
            let articleContent = this.props.highlightResults && !$.isEmpty(article.highlight_content) ?
                article.highlight_content :
                article.content;

            if (article.show) {
                return (
                    <ArticleItem
                        key={article.id}
                        currentUserId={this.props.currentUserId}
                        article={article}
                        initialDisplayMode={this.props.articleDisplayMode}>
                        {articleContent}
                    </ArticleItem>
                );
            }
        });

        if (this.props.articleDisplayMode === 'inline') {
            return (
                <div className="card-panel">
                    <div className="blog-article-list">
                        <InfiniteScroll loadMore={this._loadNextArticles}
                                        hasMore={this.props.hasMore}>
                            <ReactCSSTransitionGroup transitionName="article"
                                                     transitionAppear={true}
                                                     transitionAppearTimeout={500}
                                                     transitionEnterTimeout={500}
                                                     transitionLeaveTimeout={300}>
                                {ArticleNodes}
                            </ReactCSSTransitionGroup>
                        </InfiniteScroll>
                    </div>
                </div>
            );
        } else if (this.props.articleDisplayMode === 'card') {
            return (
                <div className="blog-article-list">
                    <InfiniteScroll loadMore={this._loadNextArticles}
                                    hasMore={this.props.hasMore}>
                        <ReactCSSTransitionGroup transitionName="article"
                                                 transitionAppear={true}
                                                 transitionAppearTimeout={500}
                                                 transitionEnterTimeout={500}
                                                 transitionLeaveTimeout={300}>
                            {ArticleNodes}
                        </ReactCSSTransitionGroup>
                    </InfiniteScroll>
                </div>
            );
        }
    },

    render () {
        return (
            <div className="row">
                <div className="col s12">
                    <ReactCSSTransitionGroup transitionName="article"
                                             transitionAppear={true}
                                             transitionAppearTimeout={500}
                                             transitionEnterTimeout={500}
                                             transitionLeaveTimeout={300}>
                        {this._renderArticles()}
                    </ReactCSSTransitionGroup>
                </div>
            </div>
        );
    }
});

module.exports = ArticleListDisplay;
