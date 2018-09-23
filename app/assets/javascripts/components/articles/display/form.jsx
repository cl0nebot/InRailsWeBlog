'use strict';

import _ from 'lodash';

import {
    Link,
    Prompt
} from 'react-router-dom';

import {
    reduxForm
} from 'redux-form/immutable';

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
    validateArticle
} from '../../../forms/article';

import ArticleModeField from './fields/mode';
import ArticleCommonField from './fields/common';
import ArticleAdvancedField from './fields/advanced';
import ArticleErrorField from './fields/error';

import EnsureValidity from '../../modules/ensureValidity';

import Submit from '../../materialize/submit';
import Collapsible from '../../theme/collapsible';

export default @reduxForm({
    validateArticle
})
@connect((state, props) => ({
    availableTags: getCategorizedTags(state),
    parentTags: getArticleParentTags(props.children),
    childTags: getArticleChildTags(props.children),
    defaultVisibility: getCurrentTopicVisibility(state)
}), {
    fetchTags
})
class ArticleFormDisplay extends React.Component {
    static propTypes = {
        isInline: PropTypes.bool,
        isEditing: PropTypes.bool,
        children: PropTypes.object,
        hasModeSelection: PropTypes.bool,
        currentMode: PropTypes.string,
        isDraft: PropTypes.bool,
        articleErrors: PropTypes.array,
        // From reduxForm
        handleSubmit: PropTypes.func,
        submitting: PropTypes.bool,
        submitSucceeded: PropTypes.bool,
        invalid: PropTypes.bool,
        dirty: PropTypes.bool,
        // From connect
        availableTags: PropTypes.array,
        parentTags: PropTypes.array,
        childTags: PropTypes.array,
        defaultVisibility: PropTypes.string,
        fetchTags: PropTypes.func
    };

    static defaultProps = {
        isInline: false,
        isEditing: false,
        children: {},
        hasModeSelection: true,
        currentMode: 'story',
        isDraft: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        isLink: false,
        isDraft: this.props.isDraft || false,
        currentMode: this.props.children.mode || this.props.currentMode
    };

    componentDidMount() {
        if (this.props.availableTags.length === 0) {
            this.props.fetchTags({availableTags: true});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // For each change in form, reduxForm reload the all form
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    }

    _handleModeClick = (mode, event) => {
        event.preventDefault();

        this.setState({
            currentMode: mode
        })
    };

    render() {
        return (
            <form className="article-form"
                  onSubmit={this.props.handleSubmit}>
                <EnsureValidity/>

                <Prompt when={this.props.dirty && !this.props.submitSucceeded}
                        message={() => I18n.t('js.article.form.unsaved')}/>

                <div className="card">
                    <h4 className="blog-form-title">
                        {
                            this.props.isEditing
                                ?
                                I18n.t('js.article.edit.title')
                                :
                                I18n.t('js.article.new.title')
                        }
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
                                                    article={this.props.children}
                                                    isDraft={this.props.isDraft}
                                                    availableTags={this.props.availableTags}
                                                    parentTags={this.props.parentTags}
                                                    childTags={this.props.childTags}
                                                    onSubmit={this.props.handleSubmit}/>
                            </div>

                            <div className="col s12 margin-top-10">
                                <Collapsible title={I18n.t('js.article.common.advanced')}
                                             isDefaultOpen={false}>
                                    <ArticleAdvancedField currentMode={this.state.currentMode}
                                                          articleReference={this.props.children.reference}
                                                          articleVisibility={this.props.children.visibility}
                                                          articleAllowComment={this.props.children.allowComment}
                                                          articleLanguage={this.props.children.currentLanguage}
                                                          defaultVisibility={this.props.defaultVisibility}/>
                                </Collapsible>
                            </div>
                        </div>
                    </div>

                    <div className="card-action">
                        <div className="row">
                            <div className="col s6 left-align">
                                <Link className="btn-flat waves-effect waves-teal"
                                      to={this.props.isEditing ? `/article/${this.props.children.slug}` : '/'}>
                                    {I18n.t('js.helpers.buttons.cancel')}
                                </Link>
                            </div>

                            <div className="col s6 right-align">
                                <Submit id="article-submit"
                                        icon="send"
                                        disabled={this.props.submitting}
                                        onSubmit={this.props.handleSubmit}>
                                    {
                                        this.props.isEditing
                                            ?
                                            I18n.t('js.article.edit.submit')
                                            :
                                            I18n.t('js.article.new.submit')
                                    }
                                </Submit>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}
