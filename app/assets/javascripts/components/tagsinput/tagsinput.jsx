'use strict';

var ReactTags = require('./reactTags');
var Tag = require('./tag');
var TagStore = require('../../stores/tagStore');

var TagsInput = React.createClass({
    propTypes: {
        labelField: React.PropTypes.string,
        initialSelectedTags: React.PropTypes.array
    },

    mixins: [
        Reflux.listenTo(TagStore, 'onTagChange')
    ],

    getDefaultProps () {
        return {
            labelField: 'name'
        };
    },

    getInitialState () {
        return {
            selectedTags: this.props.initialSelectedTags || [],
            tagList: []
        }
    },

    selectedTags () {
        return this.state.selectedTags;
    },

    resetSelectedTags () {
        this.setState({selectedTags: []});
    },

    onTagChange(tagStore) {
        this.setState({tagList: tagStore});
    },

    _onTagExists(tag) {
        let $existingTag = $(".tagsinput-tag", ".tagsinput-tags").filter(function () { return $(this).data("name") === tag; });
        $existingTag.fadeOut(200).fadeIn(200);
    },

    _handleTagClick (tagClicked, event) {
        if (!tagClicked) {
            return;
        }
        event.preventDefault();

        let selectedTags = [];
        this.state.selectedTags.forEach(function (tag, index, tags) {
            if(tagClicked.name === tag.name) {
                if(tagClicked.parent || tagClicked.child) {
                    tagClicked.parent = null;
                    tagClicked.child = null;
                } else {
                    tagClicked.parent = true;
                    tagClicked.child = null;
                }
                selectedTags.push(tagClicked);
            } else {
                selectedTags.push(tag);
            }
        }.bind(this));
        this.setState({selectedTags: selectedTags});
    },

    _handleContextMenu (tagClicked, event) {
        if (!tagClicked) {
            return;
        }
        event.preventDefault();

        let selectedTags = [];
        this.state.selectedTags.forEach(function (tag, index, tags) {
            if(tagClicked.name === tag.name) {
                if(tagClicked.child || tagClicked.parent) {
                    tagClicked.child = null;
                    tagClicked.parent = null;
                } else {
                    tagClicked.child = true;
                    tagClicked.parent = null;
                }
                selectedTags.push(tagClicked);
            } else {
                selectedTags.push(tag);
            }
        }.bind(this));
        this.setState({selectedTags: selectedTags});
    },

    _handleAddition (tag) {
        if (!tag) {
            return;
        }

        // Create tag object if new tag
        tag = tag.hasOwnProperty(this.props.labelField) ? tag : {id: null, name: tag};

        // Trim tag
        tag.name = tag.name.trim();

        // Ignore strings only contain whitespace
        if (tag.name.toString().match(/^\s*$/)) {
            return;
        }

        // Ignore items all ready added
        let existing = _.filter(this.state.selectedTags, function(selectedTag) { return selectedTag.name === tag.name})[0];
        if (existing) {
            this._onTagExists(tag.name);
            return;
        }

        // if length greater than limit
        if (tag.length + 1 > 128) {
            return;
        }

        let selectedTags = this.state.selectedTags;
        selectedTags.push(tag);
        this.setState({selectedTags: selectedTags});
    },

    _handleDelete (i) {
        let selectedTags = this.state.selectedTags;
        selectedTags.splice(i, 1);
        this.setState({selectedTags: selectedTags});
    },

    render () {
        let tagItems = this.state.selectedTags.map((function (tag, i) {
            let labelClass = '';
            if(tag.parent) {
                labelClass = 'tag-parent';
            } else if (tag.child) {
                labelClass = 'tag-child';
            }

            return (
                <Tag key={i}
                     tag={tag}
                     labelClass={labelClass}
                     labelField={this.props.labelField}
                     onClickTag={this._handleTagClick.bind(this, tag)}
                     handleContextMenu={this._handleContextMenu.bind(this, tag)}
                     onDelete={this._handleDelete.bind(this, i)}/>
            );
        }).bind(this));

        return (
            <div ref="tagsSelection"
                 className="tagsinput-tags">
                <div className="tagsinput-selected">
                    {tagItems}
                    <ReactTags selectedTags={this.state.selectedTags}
                               tagList={this.state.tagList}
                               tagMinLength={window.parameters.tag_min_length}
                               tagMaxLength={window.parameters.tag_max_length}
                               labelField={this.props.labelField}
                               handleDelete={this._handleDelete}
                               handleAddition={this._handleAddition}/>
                </div>

            </div>
        )
    }
});

module.exports = TagsInput;
