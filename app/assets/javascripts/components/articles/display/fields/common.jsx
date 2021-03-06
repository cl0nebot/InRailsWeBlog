'use strict';

import {
    Field
} from 'redux-form/immutable';

import {
    withStyles
} from '@material-ui/core/styles';

import EditorField from '../../../editor/form/editor';

import TextFieldForm from '../../../material-ui/form/text';

import styles from '../../../../../jss/article/form/common';

export default @withStyles(styles)
class ArticleCommonField extends React.Component {
    static propTypes = {
        currentMode: PropTypes.string.isRequired,
        change: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        article: PropTypes.object,
        // from styles
        classes: PropTypes.object
    };

    static defaultProps = {
        article: {},
    };

    constructor(props) {
        super(props);

        this._editor = null;
        this._pictureIds = null;
    }

    _handleEditorLoaded = (editor) => {
        this._editor = editor;
    };

    _handleImageUploaded = (image) => {
        this.props.change('picture_ids', this._pictureIds ? this._pictureIds.split(',').concat(image.id).join(',') : image.id.toString());
    };

    _handleTitleBlur = (event) => {
        if (this._editor) {
            this._editor.focus();
        }

        return event;
    };

    _handleTitleKeyPress = (event) => {
        if (Utils.NAVIGATION_KEYMAP[event.which] === 'enter') {
            if (event.ctrlKey) {
                this.props.onSubmit();
            } else if (this._editor) {
                this._editor.focus();
            }
        }

        return event;
    };

    render() {
        return (
            <div className={classNames(this.props.classes.root, 'row')}>
                {
                    this.props.currentMode === 'link'
                        ?
                        <div className="col s12">
                            <div className="form-editor-title">
                                {I18n.t('js.article.model.reference')}
                            </div>
                            <Field name="reference"
                                   id="article_reference"
                                   icon="link"
                                   label={I18n.t(`js.article.common.placeholders.reference.${this.props.currentMode}`)}
                                   characterCount={window.settings.article_title_max_length}
                                   onBlur={this._handleTitleBlur}
                                   component={TextFieldForm}/>
                        </div>
                        :
                        <div className="col s12">
                            <Field name="title"
                                   component={TextFieldForm}
                                   className={this.props.classes.title}
                                   id="article_title"
                                   label={I18n.t(`js.article.common.placeholders.title.${this.props.currentMode}`)}
                                   autoFocus={true}
                                   required={true}
                                   color="primary"
                                   onBlur={this._handleTitleBlur}
                                   onKeyPress={this._handleTitleKeyPress}/>
                        </div>
                }

                <div className="col s12">
                    <Field name="content"
                           id="article_content"
                           modelId={this.props.article.id}
                           modelName="article"
                           placeholder={I18n.t(`js.article.common.placeholders.content.${this.props.currentMode}`)}
                           onLoaded={this._handleEditorLoaded}
                           onImageUpload={this._handleImageUploaded}
                           onSubmit={this.props.onSubmit}
                           component={EditorField}
                           componentContent={this.props.article.content}/>
                </div>
            </div>
        );
    }
}
