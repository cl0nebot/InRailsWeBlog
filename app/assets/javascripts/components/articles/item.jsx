var ArticleActions = require('../../actions/articleActions');

require('../../wysiwyg/summernote');
require('../../wysiwyg/lang/summernote-fr-FR');

var HighlightCode = require('highlight.js');

var ArticleItem = React.createClass({
    getInitialState: function () {
        return {
            editor: null,
            articleDisplayMode: this.props.articleDisplayMode
        };
    },

    componentDidMount: function () {
        HighlightCode.configure({
            tabReplace: '  ' // 4 spaces
        });

        this._highlightCode();
    },

    componentDidUpdate: function () {
        if (this.state.articleDisplayMode === 'edit') {
            this.state.editor = $("#editor-summernote-" + this.props.article.id);

            var airToolbar = [
                ['style', ['style', 'bold', 'italic', 'underline']],
                ['undo', ['undo', 'redo']],
                ['view', ['fullscreen', 'codeview']],
                ['para', ['ul', 'ol']],
                ['insert', ['link', 'picture', 'video']]
            ];

            this.state.editor.summernote({
                airMode: true,
                airToolbar: airToolbar,
                lang: I18n.locale + '-' + I18n.locale.toUpperCase()
            });
        } else {
            this._highlightCode();
        }
    },

    _highlightCode: function() {
        var domNode = ReactDOM.findDOMNode(this);
        var nodes = domNode.querySelectorAll('pre code');
        if (nodes.length > 0) {
            for (var i = 0; i < nodes.length; i=i+1) {
                HighlightCode.highlightBlock(nodes[i]);
            }
        }
    },

    _onArticleWithTag: function (tagName, event) {
        ArticleActions.loadArticles({tags: [tagName]});
    },

    _renderIsLink: function () {
        if (this.props.article.is_link) {
            return (
                <div className="article-icons">
                    <i className="material-icons article-link">link</i>
                </div>
            );
        } else {
            return null;
        }
    },

    _renderVisibility: function () {
        if (this.props.userConnected) {
            if (this.props.article.visibility === 'everyone') {
                return (
                    <div className="article-icons">
                        <i className="material-icons article-public">visibility</i>
                    </div>
                );
            } else {
                return (
                    <div className="article-icons">
                        <i className="material-icons article-private">visibility_off</i>
                    </div>
                );
            }
        }
    },

    _onEditClick: function (event) {
        this.setState({articleDisplayMode: 'edit'});
    },

    _onCancelClick: function (event) {
        this.state.editor.summernote('destroy');
        this.setState({articleDisplayMode: this.props.articleDisplayMode});
    },

    _onSaveClick: function (event) {
        var content = this.state.editor.summernote('code');
        ArticleActions.updateArticles({id: this.props.article.id, content: content});

        this.state.editor.summernote('destroy');
        this.setState({articleDisplayMode: this.props.articleDisplayMode});
    },

    _renderEdit: function () {
        if (this.props.userConnected) {
            if (this.state.articleDisplayMode === 'edit') {
                return (
                    <div className="article-icons">
                        <i className="material-icons article-cancel"
                           onClick={this._onCancelClick}>
                            clear
                        </i>
                        <i className="material-icons article-update"
                           onClick={this._onSaveClick}>
                            check
                        </i>
                    </div>
                );
            } else {
                return (
                    <div className="article-icons"
                         onClick={this._onEditClick}>
                        <i className="material-icons article-edit">mode_edit</i>
                    </div>
                );
            }
        }
    },

    _renderAuthor: function () {
        return (
            <div className="article-icons">
                <i className="material-icons">account_circle</i>
                {this.props.article.author}
            </div>
        );
    },

    render: function () {
        if (this.state.articleDisplayMode === 'inline') {
            return (
                <div className="blog-article-item">
                    <h4>
                        {this.props.article.title}
                    </h4>
                    <span dangerouslySetInnerHTML={{__html: this.props.children}}/>
                </div>
            );
        } else if (this.state.articleDisplayMode === 'card') {
            var Tags = this.props.article.tags.map(function (tag) {
                return (
                    <a key={tag.id}
                       onClick={this._onArticleWithTag.bind(this, tag.name)}
                       className="waves-effect waves-light btn-small grey lighten-5 black-text">
                        {tag.name}
                    </a>
                );
            }.bind(this));

            return (
                <div className="card clearfix blog-article-item">
                    <div className="card-content">
                        <div>
                            <span className="card-title black-text">
                                <h4>{this.props.article.title}</h4>
                            </span>
                            <span dangerouslySetInnerHTML={{__html: this.props.children}}/>
                        </div>
                    </div>
                    <div className="card-action">
                        {Tags}
                        <div className="right">
                            {this._renderIsLink()}
                            {this._renderVisibility()}
                            {this._renderEdit()}
                        </div>
                    </div>
                </div>
            );
        } else if (this.state.articleDisplayMode === 'edit') {
            var Tags = this.props.article.tags.map(function (tag) {
                return (
                    <a key={tag.id}
                       onClick={this._onArticleWithTag.bind(this, tag.id)}
                       className="waves-effect waves-light btn-small grey lighten-5 black-text">
                        {tag.name}
                    </a>
                );
            }.bind(this));

            return (
                <div className="card clearfix blog-article-item">
                    <div className="card-content article-editing">
                        <div>
                            <span className="card-title black-text">
                                <h4>{this.props.article.title}</h4>
                            </span>

                            <div id={"editor-summernote-" + this.props.article.id}
                                 dangerouslySetInnerHTML={{__html: this.props.children}}/>
                        </div>
                    </div>
                    <div className="card-action">
                        {Tags}
                        <div className="right">
                            {this._renderIsLink()}
                            {this._renderVisibility()}
                            {this._renderEdit()}
                        </div>
                    </div>
                </div>
            );
        } else {
            log.info('Article display mode unknown: ' + this.state.articleDisplayMode);
            return null;
        }
    }
});

module.exports = ArticleItem;
