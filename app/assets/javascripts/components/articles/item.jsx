'use strict';

var ArticleActions = require('../../actions/articleActions');
var ArticleCardDisplay = require('./display/card');
var ArticleInlineDisplay = require('./display/inline');
var ArticleEditionDisplay = require('./display/edition');

var ArticleItem = React.createClass({
    propTypes: {
        children: React.PropTypes.string.isRequired,
        article: React.PropTypes.object.isRequired,
        initialDisplayMode: React.PropTypes.string.isRequired,
        userId: React.PropTypes.number
    },

    getDefaultProps () {
        return {
            userId: null
        };
    },

    getInitialState () {
        return {
            articleDisplayMode: this.props.initialDisplayMode
        };
    },

    componentDidMount () {
        $(ReactDOM.findDOMNode(this)).find('.tooltipped').each(function() {
            $(this).tooltip();
        });
    },

    componentDidUpdate () {
        $(ReactDOM.findDOMNode(this)).find('.tooltipped').each(function() {
            $(this).tooltip();
        });
    },

    _setDefaultDisplay (tagName, event) {
        event.preventDefault();
        this.setState({articleDisplayMode: this.props.initialDisplayMode});
    },

    _handleTagClick (tagName, event) {
        event.preventDefault();
        ArticleActions.loadArticles({tags: [tagName]});
    },

    _handleBookmarkClick (articleId, event) {
        event.preventDefault();
        ArticleActions.bookmarkArticle({articleId: articleId});
    },

    _handleEditClick (event) {
        event.preventDefault();

        let editorLoader = require('../../loaders/editor');
        editorLoader().then(({}) => {
            $(ReactDOM.findDOMNode(this)).find('.tooltipped').each(function() {
                $(this).tooltip('remove');
            });
            this.setState({articleDisplayMode: 'edit'});
        });
    },

    render () {
        if (this.state.articleDisplayMode === 'inline') {
            return (
                <ArticleInlineDisplay article={this.props.article}
                                      userId={this.props.userId}>
                    {this.props.children}
                </ArticleInlineDisplay>
            );
        } else if (this.state.articleDisplayMode === 'card') {
            return (
                <ArticleCardDisplay article={this.props.article}
                                    userId={this.props.userId}
                                    onClickTag={this._handleTagClick}
                                    onClickEdit={this._handleEditClick}
                                    onClickVisibility={this._handleVisibilityClick}
                                    onClickBookmark={this._handleBookmarkClick}>
                    {this.props.children}
                </ArticleCardDisplay>
            );
        } else if (this.state.articleDisplayMode === 'edit') {
            return (
                <ArticleEditionDisplay article={this.props.article}
                                       userId={this.props.userId}
                                       onClickTag={this._handleTagClick}
                                       setDefaultDisplay={this._setDefaultDisplay}>
                    {this.props.children}
                </ArticleEditionDisplay>
            );
        } else {
            log.info('Article display mode unknown: ' + this.state.articleDisplayMode);
            return null;
        }
    }
});

module.exports = ArticleItem;
