'use strict';

var ArticleEditIcon = ({article, onEditClick}) => {
    if ($app.user.isConnected(article.author.id)) {
        return (
            <a className="article-edit tooltipped btn-floating"
               data-tooltip={I18n.t('js.article.tooltip.edit')}
               onClick={onEditClick}>
                <i className="material-icons">mode_edit</i>
            </a>
        );
    } else {
        return null;
    }
};

ArticleEditIcon.propTypes = {
    article: React.PropTypes.object.isRequired,
    onEditClick: React.PropTypes.func
};

ArticleEditIcon.getDefaultProps = {
    onEditClick: null
};

module.exports = ArticleEditIcon;
