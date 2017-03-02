'use strict';

import {Link} from 'react-router';

const ArticleNone = ({isTopicPage, isSearchPage}) => (
    <div className="row">
        <div className="col s6 offset-s3">
            <div className="card center-align blue-grey darken-1">
                <div className="card-content white-text">
                    <span className="card-title">
                        {
                            isSearchPage &&
                            I18n.t('js.article.common.no_results.search.title')
                        }

                        {
                            isTopicPage &&
                            I18n.t('js.article.common.no_results.topic.title')
                        }
                    </span>

                    {
                        isSearchPage &&
                        <p>

                            {I18n.t('js.article.common.no_results.search.content')}
                        </p>
                    }

                    {
                        isTopicPage &&
                        <p>
                            {I18n.t('js.article.common.no_results.topic.content')}
                            <Link to="/article/new"
                                  className="waves-effect waves-light btn margin-top-20">
                                {I18n.t('js.article.common.no_results.topic.button')}
                            </Link>
                        </p>
                    }
                </div>
            </div>
        </div>
    </div>
);

ArticleNone.propTypes = {
    isSearchPage: React.PropTypes.bool,
    isTopicPage: React.PropTypes.bool
};

ArticleNone.getDefaultProps = {
    isSearchPage: true,
    isTopicPage: false
};

export default ArticleNone;
