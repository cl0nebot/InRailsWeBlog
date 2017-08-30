'use strict';

import ChildTag from './child';

export default class ParentTag extends React.PureComponent {
    static propTypes = {
        tag: PropTypes.object.isRequired,
        onTagClick: PropTypes.func.isRequired,
        isFiltering: PropTypes.bool
    };

    static defaultProps = {
        isFiltering: false
    };

    state = {
        isExpanded: false
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            isExpanded: nextProps.isFiltering
        });
    }

    _handleTagClick = (tagId, parentTagSlug, childTagSlug, event) => {
        event.preventDefault();

        if (this.props.onTagClick) {
            this.props.onTagClick(tagId, tagId, childTagSlug);
        }

        if (!this.state.isExpanded) {
            this.setState({
                isExpanded: !this.state.isExpanded
            });
        }
    };

    _handleTagIconClick = (event) => {
        event.preventDefault();

        this.setState({
            isExpanded: !this.state.isExpanded
        });
    };

    render() {
        const hasChild = !$.isEmpty(this.props.tag.children);

        return (
            <div className="tag-parent">
                {
                    hasChild
                        ?
                        <i className="material-icons tag-parent-icon"
                           onClick={this._handleTagIconClick}>
                            {this.state.isExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
                        </i>
                        :
                        <div className="tag-parent-icon">
                            &nbsp;
                        </div>
                }

                <div className="tag-parent-name"
                     onClick={this._handleTagClick.bind(this, this.props.tag.slug, this.props.tag.slug, null)}>
                    {this.props.tag.name}
                </div>

                <div className="tag-parent-children">
                    {
                        this.state.isExpanded && this.props.tag.children.map((tag, i) => (
                                <ChildTag key={i}
                                          tag={tag}
                                          parentTagSlug={this.props.tag.slug}
                                          onTagClick={this.props.onTagClick}/>
                            )
                        )
                    }
                </div>
            </div>
        );
    };
}
