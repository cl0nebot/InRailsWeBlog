'use strict';

const classNames = require('classnames');

const TagStore = require('../../../stores/tagStore');

const ToolTip = require('react-portal-tooltip');

import {Link} from 'react-router';

var ArticleTags = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        onTagClick: React.PropTypes.func,
        linkTag: React.PropTypes.string
    },

    getDefaultProps () {
        return {
            onTagClick: null,
            linkTag: null
        };
    },

    getInitialState () {
        return {
            tagTooltipActive: null
        };
    },

    _handleTagClick (tagId, tagName, event) {
        TagStore.onTrackClick(tagId);

        if (this.props.onTagClick) {
            event.preventDefault();
            this.props.onTagClick(tagId, tagName);
        }
    },

    _showTagTooltip (tagId) {
        this.setState({tagTooltipActive: tagId});
    },

    _hideTagTooltip (tagId) {
        this.setState({tagTooltipActive: null});
    },

    render () {
        const parentTags = _.keyBy(this.props.article.parent_tags, 'id');
        const childTags = _.keyBy(this.props.article.child_tags, 'id');
        const tagList = this.props.article.parent_tags.concat(this.props.article.child_tags);

        let style = {
            style: {
                background: '#535a60',
                color: '#e4e6e8',
                padding: 10,
                boxShadow: '0 1px 3px rgba(12,13,14,0.3)',
                borderRadius: '2px',
                border: '1px solid #242729'
            },
            arrowStyle: {
                color: 'rgba(0,0,0,.8)',
                borderColor: false
            }
        };

        return (
            <div className={classNames('article-tags', {'article-tags-empty': tagList.length === 0})}>
                {
                    tagList.map((tag, i) =>
                        <div key={i}
                             className="article-tag">
                            <Link id={`article-${this.props.article.id}-tags-${tag.id}`}
                                  className={classNames(
                                      'waves-effect', 'waves-light', 'btn-small',
                                      {
                                          'tag-parent': parentTags[tag.id],
                                          'tag-child': childTags[tag.id]
                                      }
                                  )}
                                  to={`/article/tags/${tag.slug}`}
                                  onClick={this._handleTagClick.bind(this, tag.id, tag.name)}
                                  onMouseEnter={this._showTagTooltip.bind(this, tag.id)}
                                  onMouseLeave={this._hideTagTooltip.bind(this, tag.id)}>
                                {tag.name}
                            </Link>

                            <ToolTip active={this.state.tagTooltipActive === tag.id}
                                     position="bottom"
                                     arrow="center"
                                     parent={`#article-${this.props.article.id}-tags-${tag.id}`}
                                     style={style}>
                                <div className="tag-tooltip">
                                    <div className="tag-tooltip-heading">
                                        {I18n.t('js.tag.common.usage', {count: tag.tagged_articles_count})}
                                    </div>

                                    <div className="tag-tooltip-description">
                                        <p>
                                            {tag.description}
                                        </p>
                                        <p>
                                            {
                                                tag.synonyms &&
                                                I18n.t('js.tag.model.synonyms') + ' : ' + tag.synonyms.join(', ')
                                            }
                                        </p>
                                        <Link to={`/tag/${tag.slug}`}>
                                            {I18n.t('js.tag.common.link')}
                                        </Link>
                                    </div>
                                </div>
                            </ToolTip>
                        </div>
                    )
                }
            </div>
        );
    }
});

module.exports = ArticleTags;
