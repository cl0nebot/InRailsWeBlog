'use strict';

import {
    inlineEditArticle
} from '../../../actions';

import {
    getArticleIsOwner
} from '../../../selectors';

import ArticleCardDisplay from './card';
import ArticleInlineDisplay from './inline';
import ArticleGridDisplay from './grid';
import ArticleInlineEditionDisplay from './inlineEdition';

export default @connect((state, props) => ({
    isOwner: getArticleIsOwner(state, props.article)
}), {
    inlineEditArticle
})
class ArticleItemDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        articleDisplayMode: PropTypes.string.isRequired,
        articleEditionId: PropTypes.number,
        isMinimized: PropTypes.bool,
        onEnter: PropTypes.func,
        onExit: PropTypes.func,
        // from connect
        isOwner: PropTypes.bool,
        isMasonry: PropTypes.bool,
        inlineEditArticle: PropTypes.func,
        onClick: PropTypes.func
    };

    static defaultProps = {
        isMinimized: false
    };

    constructor(props) {
        super(props);
    }

    _handleInlineEditClick = (event) => {
        if (event) {
            event.preventDefault();
        }

        this.props.inlineEditArticle(this.props.article.id);
    };

    render() {
        if (this.props.articleDisplayMode === 'edit' || this.props.articleEditionId === this.props.article.id) {
            return (
                <ArticleInlineEditionDisplay article={this.props.article}
                                             isOwner={this.props.isOwner}/>
            );
        } else if (this.props.articleDisplayMode === 'inline') {
            return (
                <ArticleInlineDisplay id={this.props.article.id}
                                      title={this.props.article.title}
                                      content={this.props.article.content}
                                      slug={this.props.article.slug}
                                      userSlug={this.props.article.user.slug}
                                      isMinimized={this.props.isMinimized}
                                      isOwner={this.props.isOwner}
                                      onEnter={this.props.onEnter}
                                      onExit={this.props.onExit}
                                      onInlineEdit={this._handleInlineEditClick}/>
            );
        } else if (this.props.articleDisplayMode === 'card') {
            return (
                <ArticleCardDisplay article={this.props.article}
                                    isOwner={this.props.isOwner}
                                    isMinimized={this.props.isMinimized}
                                    onInlineEdit={this._handleInlineEditClick}
                                    onEnter={this.props.onEnter}
                                    onExit={this.props.onExit}
                                    onClick={this.props.onClick}/>
            );
        } else if (this.props.articleDisplayMode === 'grid') {
            return (
                <ArticleGridDisplay article={this.props.article}
                                    isOwner={this.props.isOwner}
                                    isMinimized={this.props.isMinimized}
                                    onEnter={this.props.onEnter}
                                    onExit={this.props.onExit}
                                    onClick={this.props.onClick}/>
            );
        } else {
            throw new Error('Article display mode unknown or empty: ' + this.props.articleDisplayMode);
        }
    }
}
