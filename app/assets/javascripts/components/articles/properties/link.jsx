'use strict';

import {
    Link
} from 'react-router-dom';

const ArticleLink = ({articleId, articleSlug, onArticleClick}) => (
    <Link className="article-goto tooltipped btn-floating"
          data-tooltip={I18n.t('js.article.tooltip.link_to')}
          to={`/article/${articleSlug}`}
          onClick={_handleArticleClick.bind(undefined, articleId, onArticleClick)}>
        <i className="material-icons">home</i>
    </Link>
);

const _handleArticleClick = (articleId, onArticleClick, event) => {
    // TODO
    // ArticleStore.onTrackClick(articleId);

    if (onArticleClick) {
        onArticleClick(articleId);
    }
};

ArticleLink.propTypes = {
    articleId: PropTypes.number.isRequired,
    articleSlug: PropTypes.string.isRequired,
    onArticleClick: PropTypes.func
};

ArticleLink.getDefaultProps = {
    onArticleClick: null
};

export default ArticleLink;
