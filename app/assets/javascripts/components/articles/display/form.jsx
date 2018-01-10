'use strict';

import {
    reduxForm
} from 'redux-form/immutable';

import {
    Link
} from 'react-router-dom';

import {
    fetchTags
} from '../../../actions';

import {
    getCategorizedTags,
    getArticleParentTags,
    getArticleChildTags,
    getCurrentTopicVisibility
} from '../../../selectors';

import {
    Accordion,
    AccordionItem
} from '../../theme/accordion';

import ArticleModeField from './fields/mode';
import ArticleCommonField from './fields/common';
import ArticleAdvancedField from './fields/advanced';
import ArticleErrorField from './fields/error';

import Submit from '../../materialize/submit';

const validate = (values) => {
    const errors = {};

    const title = values.get('title');
    if (title) {
        // I18n.t('js.article.common.tooltips.title_too_short');
        if (title.length < window.settings.article_title_min_length || title.length > window.settings.article_title_max_length) {
            errors.title = I18n.t('js.article.errors.title.size', {
                min: window.settings.article_title_min_length,
                max: window.settings.article_title_max_length
            });
        }
    }

    const summary = values.get('summary');
    if (summary) {
        // I18n.t('js.article.common.tooltips.summary_too_short');
        if (summary.length < window.settings.article_summary_min_length || summary.length > window.settings.article_summary_max_length) {
            errors.summary = I18n.t('js.article.errors.summary.size', {
                min: window.settings.article_summary_min_length,
                max: window.settings.article_summary_max_length
            });
        }
    }

    let content = values.get('content');
    if (content) {
        content = content.replace(/<(?:.|\n)*?>/gm, '');
        if (content.length < window.settings.article_content_min_length || content.length > window.settings.article_content_max_length) {
            errors.content = I18n.t('js.article.errors.content.size', {
                min: window.settings.article_content_min_length,
                max: window.settings.article_content_max_length
            });
        }
    } else {
        errors.content = I18n.t('js.article.common.tooltips.content_too_short');
    }

    return errors;
};

@reduxForm({
    form: 'article',
    validate
})
@connect((state, props) => ({
    userTags: getCategorizedTags(state),
    parentTags: getArticleParentTags(props.article),
    childTags: getArticleChildTags(props.article),
    defaultVisibility: getCurrentTopicVisibility(state)
}), {
    fetchTags
})
export default class ArticleFormDisplay extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        multipleId: PropTypes.number,
        isInline: PropTypes.bool,
        children: PropTypes.object,
        hasModeSelection: PropTypes.bool,
        currentMode: PropTypes.string,
        isDraft: PropTypes.bool,
        articleErrors: PropTypes.array,
        // From reduxForm
        handleSubmit: PropTypes.func,
        submitting: PropTypes.bool,
        invalid: PropTypes.bool,
        // From connect
        userTags: PropTypes.array,
        parentTags: PropTypes.array,
        childTags: PropTypes.array,
        defaultVisibility: PropTypes.string,
        fetchTags: PropTypes.func
    };

    static defaultProps = {
        isInline: false,
        children: {},
        hasModeSelection: true,
        currentMode: 'story',
        isDraft: false
    };

    constructor(props) {
        super(props);

        if (props.userTags.length === 0) {
            props.fetchTags({userTags: true});
        }
    }

    state = {
        isLink: false,
        isDraft: this.props.isDraft || false,
        currentMode: this.props.children.mode || this.props.currentMode
    };

    _handleModeClick = (mode, event) => {
        event.preventDefault();

        this.setState({
            currentMode: mode
        })
    };

    render() {
        return (
            <form id={this.props.id}
                  className={classNames('article-form', {
                      'card': this.props.isInline
                  })}
                  onSubmit={this.props.handleSubmit}>
                <div className="">
                    <h4 className="blog-form-title">
                        {I18n.t('js.article.new.title')}
                    </h4>

                    {
                        this.props.hasModeSelection &&
                        <ArticleModeField currentMode={this.state.currentMode}
                                          onModeClick={this._handleModeClick}/>
                    }

                    <div className="form-editor-card">
                        <div className="row">
                            {
                                this.props.articleErrors &&
                                <div className="col s12">
                                    <ArticleErrorField errors={this.props.articleErrors}/>
                                </div>
                            }

                            <div className="col s12">
                                <ArticleCommonField currentMode={this.state.currentMode}
                                                    onSubmit={this.props.handleSubmit}
                                                    article={this.props.children}
                                                    isDraft={this.props.isDraft}
                                                    userTags={this.props.userTags}
                                                    parentTags={this.props.parentTags}
                                                    childTags={this.props.childTags}/>
                            </div>

                            <div className="col s12 margin-top-10">
                                <Accordion>
                                    <AccordionItem title={I18n.t('js.article.common.advanced')}
                                                   isOpen={false}>
                                        <ArticleAdvancedField currentMode={this.state.currentMode}
                                                              articleVisibility={this.props.children.visibility}
                                                              articleAllowComment={this.props.children.allowComment}
                                                              articleLanguage={this.props.children.currentLanguage}
                                                              defaultVisibility={this.props.defaultVisibility}
                                                              multipleId={this.props.multipleId}/>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    </div>

                    <div className="card-action">
                        <div className="row">
                            <div className="col s6 left-align">
                                <Link className="btn-flat waves-effect waves-teal"
                                      to={this.props.children ? `/article/${this.props.children.slug}` : '/'}>
                                    {I18n.t('js.helpers.buttons.cancel')}
                                </Link>
                            </div>

                            <div className="col s6 right-align">
                                <Submit id="article-submit"
                                        icon="send"
                                        disabled={this.props.submitting}
                                        onSubmit={this.props.handleSubmit}>
                                    {I18n.t('js.article.new.submit')}
                                </Submit>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}
