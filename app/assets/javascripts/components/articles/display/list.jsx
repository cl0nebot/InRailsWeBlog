'use strict';

import {
    TransitionGroup,
    CSSTransition
} from 'react-transition-group';

import InfiniteScroll from 'react-infinite-scroll-component';

import ArticleItemDisplay from './item';

import Pagination from '../../materialize/pagination';

const ArticleListDisplay = ({articles, articlesLoaderMode, articleDisplayMode, articleEditionId, hasMoreArticles, isSortedByTag, parentTag, articleTotalPages, fetchArticles}) => {
    let previousTag = undefined;

    const ArticleNodes = articles.map((article) => {
            let tagTitle = undefined;
            if (isSortedByTag) {
                let currentTag = article.tags.toJS();
                if (parentTag) {
                    currentTag = currentTag.filter((tag) => !article.parentTagIds.includes(tag.id))
                }
                currentTag = currentTag.sort().first();
                if (currentTag) {
                    currentTag = currentTag.name;
                }
                if (previousTag !== currentTag) {
                    tagTitle = currentTag;
                    previousTag = currentTag;
                }
                if (article.tags.size === 0) {
                    previousTag = tagTitle = I18n.t('js.article.common.tags.none');
                }
            }

            return (
                <CSSTransition key={article.id}
                               timeout={150}
                               classNames="article">
                    <div>
                        {
                            tagTitle &&
                            <h6 className="article-list-tag-title">
                                {tagTitle}
                            </h6>
                        }

                        <ArticleItemDisplay article={article}
                                            articleDisplayMode={articleDisplayMode}
                                            articleEditionId={articleEditionId}/>
                    </div>

                </CSSTransition>
            );
        }
    );

    const LoadingArticles = (
        <div className="article-infinite-loading">
            {I18n.t('js.article.common.infinite.loading')}
        </div>
    );

    return (
        <div>
            <div className={classNames({
                'card-panel': articleDisplayMode === 'inline'
            })}>
                <div className="blog-article-list">
                    {
                        articlesLoaderMode === 'infinite'
                            ?
                            <InfiniteScroll next={fetchArticles}
                                            hasMore={hasMoreArticles}
                                            loader={LoadingArticles}>
                                <TransitionGroup component="div">
                                    {ArticleNodes}
                                </TransitionGroup>
                            </InfiniteScroll>
                            :
                            <TransitionGroup component="div">
                                {ArticleNodes}
                            </TransitionGroup>
                    }
                </div>
            </div>

            {
                articlesLoaderMode === 'pagination' &&
                <Pagination totalPages={articleTotalPages}
                            onPaginationClick={fetchArticles}/>
            }
        </div>
    );
};

ArticleListDisplay.propTypes = {
    articles: PropTypes.array.isRequired,
    articlesLoaderMode: PropTypes.string.isRequired,
    articleDisplayMode: PropTypes.string.isRequired,
    fetchArticles: PropTypes.func,
    articleTotalPages: PropTypes.number,
    hasMoreArticles: PropTypes.bool,
    isSortedByTag: PropTypes.bool,
    parentTag: PropTypes.string,
    articleEditionId: PropTypes.number
};

ArticleListDisplay.defaultProps = {
    hasMoreArticles: false,
    isSortedByTag: false
};

export default ArticleListDisplay;
