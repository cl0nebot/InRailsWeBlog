'use strict';

import {
    Link
} from 'react-router-dom';

import {
    filterTags
} from '../../actions';

import {
    getTags,
    getSortedTopicTags
} from '../../selectors';

// import AssociatedTagBox from '../tags/associated/box';

import TagRelationshipDisplay from './display/relationship';

import SearchBar from '../theme/searchBar';
import Loader from '../theme/loader';

@connect((state) => ({
    isLoading: state.tagState.isFetching,
    filterText: state.tagState.filterText,
    currentTopicSlug: state.topicState.currentTopic && state.topicState.currentTopic.slug,
    tags: state.userState.isConnected ? getSortedTopicTags(state) : getTags(state)
}), {
    filterTags
})
export default class TagSidebar extends React.Component {
    static propTypes = {
        hasChildInMainList: PropTypes.bool,
        // From connect
        isLoading: PropTypes.bool,
        filterText: PropTypes.string,
        currentTopicSlug: PropTypes.string,
        tags: PropTypes.array,
        filterTags: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    _handleSearchInput = (value) => {
        this.props.filterTags(value);
    };

    render() {
        const isFiltering = !Utils.isEmpty(this.props.filterText);

        return (
            <div className="blog-sidebar-tag">
                {
                    this.props.isLoading &&
                    <div className="center">
                        <Loader/>
                    </div>
                }

                {
                    !this.props.isLoading &&
                    <div>
                        <h3 className="sidebar-title">
                            {I18n.t('js.tag.common.list')}

                            <Link className="tags-link"
                                  to={`/user/${this.props.currentTopicSlug}/tags`}>
                                <span className="material-icons"
                                      data-icon="open_in_new"
                                      aria-hidden="true"/>
                            </Link>
                        </h3>

                        {
                            !Utils.isEmpty(this.props.tags) &&
                            <SearchBar label={I18n.t('js.tag.common.filter')}
                                       onSearchInput={this._handleSearchInput}>
                                {this.props.filterText}
                            </SearchBar>
                        }

                        {
                            this.props.tags.length > 0 &&
                            <TagRelationshipDisplay tags={this.props.tags}
                                                    hasChildInMainList={this.props.hasChildInMainList}
                                                    isFiltering={isFiltering}/>
                        }

                        {
                            Utils.isEmpty(this.props.tags) &&
                            (
                                this.props.filterText
                                    ?
                                    <div className="sidebar-empty">
                                        {I18n.t('js.tag.common.no_results') + ' ' + this.props.filterText}
                                    </div>
                                    :
                                    <div className="sidebar-empty">
                                        {I18n.t('js.tag.common.no_tags')}
                                    </div>
                            )
                        }
                    </div>
                }
            </div>
        );
    }
}
