'use strict';

const classNames = require('classnames');

var ArticleOutdatedIcon = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        onOutdatedClick: React.PropTypes.func.isRequired
    },

    getDefaultProps () {
        return {
        };
    },

    getInitialState () {
        return {
            isOutdated: this.props.article.outdated
        };
    },

    _handleOutdatedClick (articleId, event) {
        event.preventDefault();
        this.props.onOutdatedClick(articleId, this.state.isOutdated);
        this.setState({isOutdated: !this.state.isOutdated})
    },

    render () {
        if ($app.user.isConnected()) {
            let outdatedClasses = classNames('material-icons', {'article-outdated': this.state.isOutdated});
            let outdatedTooltip = this.state.isOutdated ?
                I18n.t('js.article.tooltip.remove_outdated') :
                I18n.t('js.article.tooltip.add_outdated');

            return (
                <a className="tooltipped btn-floating"
                   data-tooltip={outdatedTooltip}
                   onClick={this._handleOutdatedClick.bind(this, this.props.article.id)}>
                    <i className={outdatedClasses}>highlight_off</i>
                </a>
            );
        } else {
            return null;
        }
    }
});

module.exports = ArticleOutdatedIcon;