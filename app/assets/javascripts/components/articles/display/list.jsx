var InfiniteScroll = require('../../../components/materialize/infiniteScroll');

var ArticleActions = require('../../../actions/articleActions');
var ArticleItem = require('../item');

var ArticleListDisplay = React.createClass({
    propTypes: {
        articles: React.PropTypes.array.isRequired,
        hasMore: React.PropTypes.bool.isRequired,
        articleDisplayMode: React.PropTypes.string.isRequired,
        highlightResults: React.PropTypes.bool,
        userId: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            userId: null,
            highlightResults: false
        };
    },

    _loadNextArticles: function () {
        if (this.props.hasMore) {
            ArticleActions.loadNextArticles();
        }
    },

    _displayMode: function () {
        var ArticleNodes = this.props.articles.map(function (article) {
            var articleContent = this.props.highlightResults && !$.isEmpty(article.highlight_content) ?
                article.highlight_content :
                article.content;

            if(article.show) {
                return (
                    <ArticleItem
                        key={article.id}
                        userId={this.props.userId}
                        article={article}
                        articleDisplayMode={this.props.articleDisplayMode}>
                        {articleContent}
                    </ArticleItem>
                );
            }
        }.bind(this));

        if (this.props.articleDisplayMode === 'inline') {
            return (
                <div className="card-panel">
                    <div className="blog-article-list">
                        <InfiniteScroll loadMore={this._loadNextArticles} hasMore={this.props.hasMore}>
                            {ArticleNodes}
                        </InfiniteScroll>
                    </div>
                </div>
            );
        } else if (this.props.articleDisplayMode === 'card') {
            return (
                <div className="blog-article-list">
                    <InfiniteScroll loadMore={this._loadNextArticles} hasMore={this.props.hasMore}>
                        {ArticleNodes}
                    </InfiniteScroll>
                </div>
            );
        }
    },

    render: function () {
        return (
            <div className="row">
                <div className="col s12">
                    { this._displayMode() }
                </div>
            </div>
        );
    }
});

module.exports = ArticleListDisplay;