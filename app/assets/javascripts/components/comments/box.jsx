'use strict';

import '../../../stylesheets/components/comment.scss';

import {
    hot
} from 'react-hot-loader';

import {
    CSSTransition
} from 'react-transition-group';

import {
    withStyles
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import CommentIcon from '@material-ui/icons/Comment';

import {
    fetchComments,
    addComment,
    updateComment,
    deleteComment
} from '../../actions';

import {
    getIsPrimaryUser,
    getComments,
    getCommentPagination
} from '../../selectors';

import Pagination from '../materialize/pagination';
import CircleSpinner from '../theme/spinner/circle';

import CommentList from '../comments/list';
import CommentForm from '../comments/form';

import styles from '../../../jss/comment/box';

export default @hot(module)

@connect((state) => ({
    isUserConnected: state.userState.isConnected,
    currentUserId: state.userState.currentId,
    isSuperUserConnected: getIsPrimaryUser(state),
    comments: getComments(state),
    commentsPagination: getCommentPagination(state),
    isLoadingComments: state.commentState.isFetching
}), {
    fetchComments,
    addComment,
    updateComment,
    deleteComment
})

@withStyles(styles)
class CommentBox extends React.Component {
    static propTypes = {
        commentableId: PropTypes.number.isRequired,
        ownerId: PropTypes.number.isRequired,
        isUserOwner: PropTypes.bool.isRequired,
        commentableType: PropTypes.string,
        id: PropTypes.string,
        commentsCount: PropTypes.number,
        isPaginated: PropTypes.bool,
        isRated: PropTypes.bool,
        // from connect
        isUserConnected: PropTypes.bool,
        currentUserId: PropTypes.number,
        isSuperUserConnected: PropTypes.bool,
        comments: PropTypes.array,
        commentsPagination: PropTypes.object,
        isLoadingComments: PropTypes.bool,
        fetchComments: PropTypes.func,
        addComment: PropTypes.func,
        updateComment: PropTypes.func,
        deleteComment: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    static defaultProps = {
        isUserConnected: false,
        isSuperUserConnected: false,
        isPaginated: false,
        isRated: true
    };

    constructor(props) {
        super(props);
    }

    state = {
        isCommentsLoaded: false,
        isShowingCommentForm: false
    };

    componentDidMount() {
        if (!this.state.isCommentsLoaded) {
            this._loadComments();
        }
    }

    _loadComments = () => {
        if (!this.state.isCommentsLoaded && !this.props.isLoadingComments) {
            // Check if comment count is not null to avoid useless fetching
            if (!Utils.isEmpty(this.props.commentsCount) && this.props.commentsCount === 0) {
                this.setState({
                    isCommentsLoaded: true
                });

                return;
            }

            this.props.fetchComments({
                commentableType: this.props.commentableType,
                commentableId: this.props.commentableId,
                isPaginated: this.props.isPaginated
            });
        }
    };

    _handlePaginationClick = (paginate) => {
        this.props.fetchComments({
            commentableType: this.props.commentableType,
            commentableId: this.props.commentableId,
            page: paginate.selected + 1
        });
    };

    _handleShowFormComment = (event) => {
        event.preventDefault();
        if (this.props.isUserConnected || this.props.isSuperUserConnected) {
            this.setState({isShowingCommentForm: true});
        } else {
            Notification.alert(I18n.t('js.comment.flash.creation_unpermitted'));
        }
    };

    _handleCommentCancel = (event) => {
        event.preventDefault();
        this.setState({isShowingCommentForm: false});
    };

    _handleCommentDelete = (commentId) => {
        if (this.props.isUserConnected || this.props.isSuperUserConnected) {
            if (commentId) {
                this.props.deleteComment(commentId, this.props.commentableType, this.props.commentableId);
            }
        } else {
            Notification.alert(I18n.t('js.comment.flash.creation_unpermitted'));
        }
    };

    _handleCommentSubmit = (commentData) => {
        this.setState({isShowingCommentForm: false});

        if (this.props.isUserConnected || this.props.isSuperUserConnected) {
            if (commentData.id) {
                this.props.updateComment(commentData, this.props.commentableType, this.props.commentableId);
            } else {
                this.props.addComment(commentData, this.props.commentableType, this.props.commentableId);
            }
        } else {
            Notification.alert(I18n.t('js.comment.flash.creation_unpermitted'));
        }
    };

    render() {
        return (
            <div id={this.props.id}
                 className={classNames('comments', this.props.classes.root)}>
                <h2 className={this.props.classes.title}>
                    {I18n.t('js.comment.common.title')}
                </h2>

                <div className={this.props.classes.content}>
                    {
                        this.props.isLoadingComments &&
                        <CircleSpinner className="center-align"/>
                    }

                    {
                        (this.props.comments && this.props.comments.length === 0 && !this.state.isShowingCommentForm) &&
                        (
                            !this.props.isUserOwner
                                ?
                                <div className="comments-none">
                                    {I18n.t('js.comment.common.empty')}
                                </div>
                                :
                                <div className="comments-none">
                                    {I18n.t('js.comment.common.no_opinion')}
                                </div>
                        )
                    }

                    <CommentList comments={this.props.comments}
                                 isConnected={this.props.isUserConnected}
                                 isOwner={this.props.isUserOwner}
                                 isRated={this.props.isRated}
                                 ownerId={this.props.ownerId}
                                 currentUserId={this.props.currentUserId}
                                 isSuperUser={this.props.isSuperUserConnected}
                                 onDelete={this._handleCommentDelete}
                                 onSubmit={this._handleCommentSubmit}/>

                    {
                        this.state.isCommentsLoaded && !this.state.isShowingCommentForm && !this.props.isUserOwner &&
                        <div className="center-align">
                            <Button color="primary"
                                    variant="outlined"
                                    onClick={this._handleShowFormComment}>
                                <CommentIcon className={this.props.classes.leftIcon}/>
                                {I18n.t('js.comment.new.button')}
                            </Button>
                        </div>
                    }

                    <CSSTransition classNames="comment-form"
                                   timeout={400}
                                   in={this.state.isShowingCommentForm}
                                   mountOnEnter={true}
                                   unmountOnExit={true}>
                        <CommentForm isOwner={this.props.isUserOwner}
                                     isRated={this.props.isRated}
                                     onCancel={this._handleCommentCancel}
                                     onSubmit={this._handleCommentSubmit}/>
                    </CSSTransition>

                    {
                        this.props.isPaginated && this.props.commentsPagination &&
                        <Pagination className="margin-top-30"
                                    totalPages={this.props.commentsPagination.totalPages}
                                    onPaginationClick={this._handlePaginationClick}/>
                    }
                </div>
            </div>
        );
    }
}

