'use strict';

import {
    Menu
} from 'semantic-ui-react';

import {
    updateUserSettings
} from '../../actions';

import RadioButtons from '../materialize/radioButtons';
import SwitchButton from '../materialize/switchButton';

@connect((state) => ({
    currentUserId: state.userState.currentId,
    user: state.userState.user,
    settings: state.userState.user.settings,
    articlesLoader: state.userState.user && state.userState.user.settings.articlesLoader,
    articleDisplay: state.userState.user && state.userState.user.settings.articleDisplay,
    tagSidebarWithChild: state.userState.user && state.userState.user.settings.tagSidebarWithChild,
    searchHighlight: state.userState.user && state.userState.user.searchHighlight,
    searchOperator: state.userState.user && state.userState.user.settings.searchOperator,
    searchExact: state.userState.user && state.userState.user.settings.searchExact
}), {
    updateUserSettings
})
export default class UserSettings extends React.Component {
    static propTypes = {
        // From connect
        currentUserId: PropTypes.number,
        articlesLoader: PropTypes.string,
        articleDisplay: PropTypes.string,
        tagSidebarWithChild: PropTypes.bool,
        searchHighlight: PropTypes.bool,
        searchOperator: PropTypes.string,
        searchExact: PropTypes.bool,
        updateUserSettings: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    state = {
        activeItem: I18n.t('js.user.settings.article.title')
    };

    _handleItemClick = (event, {name}) => {
        this.setState({
            activeItem: name
        });
    };

    _onLoaderChanged = (event) => {
        this._updateSettings({articlesLoader: event.target.id});
    };

    _onDisplayChanged = (event) => {
        this._updateSettings({articleDisplay: event.target.id});
    };

    _onTagSidebarWithChildChanged = (value) => {
        this._updateSettings({tagSidebarWithChild: value});
    };

    _onHighlightChanged = (value) => {
        this._updateSettings({searchHighlight: value});
    };

    _onOperatorSearchChanged = (event) => {
        this._updateSettings({searchOperator: event.target.id});
    };

    _onExactSearchChanged = (value) => {
        this._updateSettings({searchExact: value});
    };

    _updateSettings = (setting) => {
        this.props.updateUserSettings(this.props.currentUserId, setting);
    };

    render() {
        const {activeItem} = this.state;

        return (
            <div>
                <Menu pointing={true}
                      secondary={true}>
                    <Menu.Item name={I18n.t('js.user.settings.article.title')}
                               active={activeItem === I18n.t('js.user.settings.article.title')}
                               onClick={this._handleItemClick}/>
                    <Menu.Item name={I18n.t('js.user.settings.tag.title')}
                               active={activeItem === I18n.t('js.user.settings.tag.title')}
                               onClick={this._handleItemClick}/>
                    <Menu.Item name={I18n.t('js.user.settings.search.title')}
                               active={activeItem === I18n.t('js.user.settings.search.title')}
                               onClick={this._handleItemClick}/>
                </Menu>

                {
                    activeItem === I18n.t('js.user.settings.article.title') &&
                    <div className="row">
                        <div className="col s12">
                            <h6>
                                {I18n.t('js.user.settings.article.loader.title')}
                            </h6>
                            <RadioButtons group="articlesLoader"
                                          buttons={I18n.t('js.user.settings.article.loader.mode')}
                                          checkedButton={this.props.articlesLoader}
                                          onChange={this._onLoaderChanged}/>
                        </div>
                        <div className="col s12">
                            <h6>
                                {I18n.t('js.user.settings.article.display.title')}
                            </h6>
                            <RadioButtons group="articleDisplay"
                                          buttons={I18n.t('js.user.settings.article.display.mode')}
                                          checkedButton={this.props.articleDisplay}
                                          onChange={this._onDisplayChanged}/>
                        </div>
                    </div>
                }

                {
                    activeItem === I18n.t('js.user.settings.tag.title') &&
                    <div className="row">
                        <div className="col s12">
                            <h6>
                                {I18n.t('js.user.settings.tag.sidebar.title')}
                            </h6>
                            <SwitchButton id="tag-sidebar-child"
                                          title={I18n.t('js.user.settings.tag.sidebar.with_child')}
                                          values={I18n.t('js.checkbox')}
                                          onChange={this._onTagSidebarWithChildChanged}>
                                {this.props.tagSidebarWithChild}
                            </SwitchButton>
                        </div>
                    </div>
                }

                {
                    activeItem === I18n.t('js.user.settings.search.title') &&
                    <div className="row">
                        <div className="col s12">
                            <h6>
                                {I18n.t('js.user.settings.search.operator.title')}
                            </h6>
                            <RadioButtons group="searchOperator"
                                          buttons={I18n.t('js.user.settings.search.operator.mode')}
                                          checkedButton={this.props.searchOperator}
                                          onChange={this._onOperatorSearchChanged}/>
                        </div>
                        <div className="col s12">
                            <SwitchButton id="search-highlight"
                                          title={I18n.t('js.user.settings.search.highlight')}
                                          values={I18n.t('js.checkbox')}
                                          onChange={this._onHighlightChanged}>
                                {this.props.searchHighlight}
                            </SwitchButton>
                        </div>
                        <div className="col s12">
                            <SwitchButton id="search-exact"
                                          title={I18n.t('js.user.settings.search.exact')}
                                          values={I18n.t('js.checkbox')}
                                          onChange={this._onExactSearchChanged}>
                                {this.props.searchExact}
                            </SwitchButton>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
