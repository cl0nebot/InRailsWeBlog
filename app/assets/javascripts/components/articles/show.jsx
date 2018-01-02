'use strict';

import _ from 'lodash';

import {
    Link
} from 'react-router-dom';

import HighlightCode from 'highlight.js';

import {
    fetchArticle
} from '../../actions';

import {
    getArticleIsOwner,
    getArticleIsOutdated
} from '../../selectors';

import LoadingLayout from '../layouts/loading';

import AnimatedText from '../theme/animatedText';

import ArticleHistory from './history';
import CountCommentIcon from '../comments/icons/count';
import ArticleOutdatedIcon from './icons/outdated';
import ArticleVisibilityIcon from './icons/visibility';
import ArticleBookmarkIcon from './icons/bookmark';
import ArticleHistoryIcon from './icons/history';
import ArticleDeleteIcon from './icons/delete';
import ArticleTags from './properties/tags';
import ArticleTime from './properties/time';

import UserAvatarIcon from '../users/icons/avatar';

import CommentBox from '../comments/box';

@connect((state) => ({
    isFetching: state.articleState.isFetching,
    article: state.articleState.article,
    isOwner: getArticleIsOwner(state),
    isOutdated: getArticleIsOutdated(state.articleState.article),
    isUserConnected: state.userState.isConnected,
}), {
    fetchArticle
})
export default class ArticleShow extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        // From connect
        isFetching: PropTypes.bool,
        article: PropTypes.object,
        isOwner: PropTypes.bool,
        isOutdated: PropTypes.bool,
        isUserConnected: PropTypes.bool,
        fetchArticle: PropTypes.func
    };

    constructor(props) {
        super(props);

        props.fetchArticle(props.params.articleSlug);
    }

    state = {
        articleVersions: undefined,
        isHistoryDisplayed: false
    };

    componentDidMount() {
        // Highlight code in article content
        HighlightCode.configure({
            tabReplace: '  ' // 2 spaces
        });

        this._highlightCode();
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.params, nextProps.params)) {
            this.props.fetchArticle(nextProps.params.articleSlug);
        }
    }

    componentDidUpdate() {
        this._highlightCode();
    }

    // onArticleChange(articleData) {
    //     // TODO
    //     if (articleData.type === 'loadArticleHistory') {
    //         newState.isHistoryDisplayed = true;
    //         newState.articleVersions = articleData.articleVersions;
    //     }
    //
    //     if (articleData.type === 'restoreArticle') {
    //         newState.isHistoryDisplayed = false;
    //         newState.article = articleData.articleRestored;
    //         Notification.success(I18n.t('js.article.history.restored'), 10);
    //     }
    // }

    _highlightCode = () => {
        if (!this.props.article) {
            return;
        }

        let domNode = ReactDOM.findDOMNode(this);
        let nodes = domNode.querySelectorAll('pre code');
        if (nodes.length > 0) {
            for (let i = 0; i < nodes.length; i = i + 1) {
                HighlightCode.highlightBlock(nodes[i]);
            }
        }
    };

    _handleUserClick = (userId, event) => {
        event.preventDefault();

        // TODO
        // UserStore.onTrackClick(userId);
    };

    _handleHistoryClick = () => {
        // TODO
        // if (this.state.isHistoryDisplayed) {
        //     this.setState({isHistoryDisplayed: false});
        // } else {
        //     ArticleActions.loadArticleHistory({history: this.props.article.id});
        // }
    };

    _handleDeleteClick = (event) => {
        event.preventDefault();

        // TODO
        // if (this.props.article) {
        //     ArticleActions.deleteArticle({id: this.props.article.id, showMode: true});
        // }
    };

    _handleBookmarkClick = (articleId, isBookmarked) => {
        // TODO
        // ArticleActions.bookmarkArticle({articleId: articleId, isBookmarked: isBookmarked});
    };

    _handleVoteClick = (articleId, isUp) => {
        // TODO
        // ArticleActions.voteArticle({articleId: articleId, isUp: isUp});
    };

    _handleOutdatedClick = (articleId, isOutdated) => {
        // TODO
        // ArticleActions.outdateArticle({articleId: articleId, isOutdated: isOutdated});
    };

    render() {
        if (!this.props.article) {
            return (
                <LoadingLayout/>
            )
        }

        return (
            <div>
                {
                    this.props.isOutdated &&
                    <div className="card center-align red-text">
                        <p>
                            {I18n.t('js.article.common.outdated')}
                        </p>
                    </div>
                }

                <div className={classNames('card blog-article-item clearfix', {'article-outdated': this.props.isOutdated})}>
                    <div className="card-content">
                        <UserAvatarIcon user={this.props.article.user}
                                        className="article-user"/>

                        <div className="article-info right-align">
                            <ArticleTime lastUpdate={this.props.article.updatedAt}/>

                            <CountCommentIcon linkToComment={'/articles/' + this.props.article.slug}
                                              commentsNumber={this.props.article.commentsNumber}/>
                        </div>

                        {
                            (!$.isEmpty(this.props.article.title) || !$.isEmpty(this.props.article.summary)) &&
                            <AnimatedText title={this.props.article.title}
                                          subtitle={this.props.article.summary}/>
                        }

                        <span className="blog-article-content"
                              dangerouslySetInnerHTML={{__html: this.props.article.content}}/>
                    </div>

                    <div className="card-action article-action clearfix">
                        <div className="row">
                            <div className="col s12 m12 l6 md-margin-bottom-20">
                                <ArticleTags articleId={this.props.article.id}
                                             tags={this.props.article.tags}
                                             parentTagIds={this.props.article.parentTagIds}
                                             childTagIds={this.props.article.childTagIds}/>

                                <a className="btn-floating"
                                   onClick={this._handleVoteClick.bind(this, this.props.article.id, true)}>
                                    <span className="material-icons"
                                          data-icon="thumb_up"
                                          aria-hidden="true"/>
                                </a>

                                <a className="btn-floating"
                                   onClick={this._handleVoteClick.bind(this, this.props.article.id, false)}>
                                    <span className="material-icons"
                                          data-icon="thumb_down"
                                          aria-hidden="true"/>
                                </a>

                                <span>
                                    {this.props.article.votes_up}
                                </span>

                                <span>
                                    {this.props.article.votes_down}
                                </span>
                            </div>

                            <div className="col s12 m12 l6 right-align">
                                <ArticleDeleteIcon isOwner={this.props.isOwner}
                                                   onDeleteClick={this._handleDeleteClick}/>

                                <ArticleBookmarkIcon articleId={this.props.article.id}
                                                     isUserConnected={this.props.isUserConnected}
                                                     onBookmarkClick={this._handleBookmarkClick}/>

                                <ArticleOutdatedIcon articleId={this.props.article.id}
                                                     isUserConnected={this.props.isUserConnected}
                                                     isOutdated={this.props.isOutdated}
                                                     onOutdatedClick={this._handleOutdatedClick}/>

                                <ArticleVisibilityIcon articleId={this.props.article.id}
                                                       articleVisibility={this.props.article.visibility}
                                                       isOwner={this.props.isOwner}
                                                       hasFloatingButton={true}/>

                                <ArticleHistoryIcon isUserConnected={this.props.isUserConnected}
                                                    onHistoryClick={this._handleHistoryClick}/>

                                {
                                    this.props.isUserConnected &&
                                    <Link className="btn-floating article-edit tooltipped"
                                          data-tooltip={I18n.t('js.article.tooltip.edit')}
                                          to={`/article/${this.props.article.id}/edit`}>
                                        <span className="material-icons"
                                              data-icon="mode_edit"
                                              aria-hidden="true"/>
                                    </Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {
                    // TODO
                    // this.props.location.state && this.props.location.state.newTags &&
                    // <div className="card-panel">
                    //     <p>
                    //         {I18n.t('js.article.show.new_tags')}
                    //         {
                    //             this.props.location.state.newTags.map((newTag, i) => (
                    //                 <Link key={i}
                    //                       to={`/tag/${newTag.slug}`}
                    // onClick={spyTrackClick.bind(null, 'tag', tag.id)}>
                    //                     {newTag.name}
                    //                 </Link>
                    //             ))
                    //         }
                    //     </p>
                    // </div>
                }

                {
                    // TODO
                    // this.state.isHistoryDisplayed && this.props.articleVersions &&
                    // <ArticleHistory articleVersions={this.props.articleVersions}/>
                }

                {
                    // TODO
                    // this.props.article.allow_comment &&
                    // <div className="card-panel">
                    //     <CommentBox id="comments"
                    //                 commentableType="articles"
                    //                 commentableId={this.props.article.id}
                    //                 isConnected={this.props.isUserConnected}
                    //                 currentUserId={this.props.userCurrentId}
                    //                 isPaginated={true}
                    //                 isRated={true}/>
                    // </div>
                }
            </div>
        );
    }
}
