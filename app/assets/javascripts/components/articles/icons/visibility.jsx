'use strict';

// TODO: use connect for article visibility and user connected
const ArticleVisibilityIcon = ({articleId, articleVisibility, isUserConnected, hasFloatingButton}) => {
    if (!isUserConnected) {
        return null;
    }

    const isVisible = articleVisibility === 'everyone';

    const visibilityClasses = classNames(
        'article-visibility',
        'tooltipped',
        {
            'btn-floating': hasFloatingButton
        },
        {
            'article-public': isVisible,
            'article-private': !isVisible
        });

    const visibilityName = I18n.t('js.article.enums.visibility.' + articleVisibility);
    const visibilityTooltip = I18n.t('js.article.tooltip.visibility', {visibility: visibilityName});

    return (
        <a className={visibilityClasses}
           data-tooltip={visibilityTooltip}>
            <span className="material-icons"
                  data-icon={isVisible ? 'visibility' : 'visibility_off'}
                  aria-hidden="true"/>
        </a>
    );
};

ArticleVisibilityIcon.propTypes = {
    articleId: PropTypes.number.isRequired,
    articleVisibility: PropTypes.string.isRequired,
    isUserConnected: PropTypes.bool,
    hasFloatingButton: PropTypes.bool
};

ArticleVisibilityIcon.defaultProps = {
    isUserConnected: false,
    hasFloatingButton: false
};

export default ArticleVisibilityIcon;
