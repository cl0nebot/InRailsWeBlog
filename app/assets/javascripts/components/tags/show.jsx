'use strict';

import {
    Link
} from 'react-router-dom';

import {
    spyTrackClick
} from '../../actions';

import UserAvatarIcon from '../users/icons/avatar';

// TODO: use redux to get and received tag
export default class TagShow extends React.Component {
    static propTypes = {
        tag: PropTypes.object,
        params: PropTypes.object,
        location: PropTypes.object,
    };

    static defaultProps = {
        params: {},
        location: {}
    };

    constructor(props) {
        super(props);

        if (props.tag) {
            this.state.tag = props.tag;
        } else if (props.params.tagId) {
            this.props.fetchTag({id: this.props.params.tagId});
        }
    }

    state = {
        tag: undefined
    };

    // onTagChange(tagData) {
    //     if (Utils.isEmpty(tagData)) {
    //         return;
    //     }
    //
    //     let newState = {};
    //
    //     if (tagData.type === 'loadTag') {
    //         newState.tag = tagData.tag;
    //     }
    //
    //     if (!Utils.isEmpty(newState)) {
    //         this.setState(newState);
    //     }
    // }

    _handleUserClick = (userId, event) => {
        // use Link from router
        // UserStore.onTrackClick(userId);
        return event;
    };

    // _handleDeleteClick (event) {
    //     event.preventDefault();
    //     if (this.state.article) {
    //         ArticleActions.deleteArticle({id: this.state.article.id, showMode: true});
    //     }
    // }

    render() {
        if (Utils.isEmpty(this.state.tag)) {
            return null;
        }

        return (
            <div>
                <div className="card blog-tag-item clearfix">
                    <div className="card-content">
                        <UserAvatarIcon user={this.state.tag.user}
                                        className="article-user"/>

                        <h1 className="center-align">
                            <span>
                                {this.state.tag.name}
                            </span>
                        </h1>

                        <p className="tag-item-description">
                            {
                                this.state.tag.description
                                    ?
                                    this.state.tag.description
                                    :
                                    <span className="tag-item-no-description">
                                            {I18n.t('js.tag.common.no_description')}
                                        </span>
                            }
                        </p>

                        <p className="tag-item-synonyms">
                            {
                                this.state.tag.synonyms
                                    ?
                                    this.state.tag.synonyms
                                    :
                                    <span className="tag-item-no-synonyms">
                                            {I18n.t('js.tag.common.no_synonyms')}
                                        </span>
                            }
                        </p>

                        <p className="tag-item-visibility">
                            {I18n.t('js.tag.model.visibility') + ': '}
                            {
                                this.state.tag.visibility_translated
                            }
                        </p>

                        <p className="tag-item-parents margin-bottom-20">
                            {I18n.t('js.tag.show.parents')}

                            {
                                this.state.tag.parents && this.state.tag.parents.length > 0
                                    ?
                                    this.state.tag.parents.map((tag) => (
                                        <Link key={tag.id}
                                              className="btn-small waves-effect waves-light tag-parent"
                                              to={`/tag/${tag.slug}`}
                                              onClick={spyTrackClick.bind(null, 'tag', tag.id)}>
                                            {tag.name}
                                        </Link>
                                    ))
                                    :
                                    <span className="tag-item-no-parents">
                                        {I18n.t('js.tag.common.no_parents')}
                                    </span>
                            }
                        </p>

                        <p className="tag-item-children margin-bottom-20">
                            {I18n.t('js.tag.show.children')}

                            {
                                this.state.tag.children && this.state.tag.children.length > 0
                                    ?
                                    this.state.tag.children.map((tag) => (
                                        <Link key={tag.id}
                                              className="btn-small waves-effect waves-light tag-child"
                                              to={`/tag/${tag.slug}`}
                                              onClick={spyTrackClick.bind(null, 'tag', tag.id)}>
                                            {tag.name}
                                        </Link>
                                    ))
                                    :
                                    <span className="tag-item-no-children">
                                            {I18n.t('js.tag.common.no_children')}
                                        </span>
                            }
                        </p>
                    </div>

                    <div className="card-action article-action clearfix">
                        <div className="row">
                            <div className="col s12 m12 l6 md-margin-bottom-20">
                                <Link className="btn btn-default waves-effect waves-light"
                                      to={`/`}>
                                    {I18n.t('js.tag.show.back_button')}
                                </Link>
                            </div>

                            <div className="col s12 m12 l6 right-align">
                                <Link className="btn waves-effect waves-light"
                                      to={`/tag/${this.state.tag.slug}/edit`}>
                                    {I18n.t('js.tag.show.edit_link')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
