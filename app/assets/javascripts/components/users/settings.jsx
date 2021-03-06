'use strict';

import {
    updateUserSettings
} from '../../actions';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default @connect((state) => ({
    currentUserId: state.userState.currentId,
    user: state.userState.user,
    settings: state.userState.user.settings,
    articlesLoader: state.userState.user && state.userState.user.settings.articlesLoader,
    articleDisplay: state.userState.user && state.userState.user.settings.articleDisplay,
    tagParentAndChild: state.userState.user && state.userState.user.settings.tagParentAndChild,
    tagSidebarPin: state.userState.user && state.userState.user.settings.tagSidebarPin,
    tagSidebarWithChild: state.userState.user && state.userState.user.settings.tagSidebarWithChild,
    tagOrder: state.userState.user && state.userState.user.settings.tagOrder,
    searchHighlight: state.userState.user && state.userState.user.settings.searchHighlight,
    searchOperator: state.userState.user && state.userState.user.settings.searchOperator,
    searchExact: state.userState.user && state.userState.user.settings.searchExact
}), {
    updateUserSettings
})

class UserSettings extends React.Component {
    static propTypes = {
        // from connect
        currentUserId: PropTypes.number,
        articlesLoader: PropTypes.string,
        articleDisplay: PropTypes.string,
        tagParentAndChild: PropTypes.bool,
        tagSidebarPin: PropTypes.bool,
        tagSidebarWithChild: PropTypes.bool,
        tagOrder: PropTypes.string,
        searchHighlight: PropTypes.bool,
        searchOperator: PropTypes.string,
        searchExact: PropTypes.bool,
        updateUserSettings: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    state = {
        tabIndex: 0,
        articlesLoader: this.props.articlesLoader,
        articleDisplay: this.props.articleDisplay,
        tagParentAndChild: this.props.tagParentAndChild,
        tagSidebarPin: this.props.tagSidebarPin,
        tagSidebarWithChild: this.props.tagSidebarWithChild,
        tagOrder: this.props.tagOrder,
        searchHighlight: this.props.searchHighlight,
        searchOperator: this.props.searchOperator,
        searchExact: this.props.searchExact
    };

    _handleTabChange = (event, value) => {
        this.setState({tabIndex: value});
    };

    _updateSettings = (setting) => {
        this.props.updateUserSettings(this.props.currentUserId, setting);
    };

    _onSettingRadioChange = (setting, event) => {
        this.setState({
            [setting]: event.target.value
        });

        this._updateSettings({[setting]: event.target.value});
    };

    _onSettingSwitchChange = (setting, event) => {
        this.setState({
            [setting]: event.target.checked
        });

        this._updateSettings({[setting]: event.target.checked});
    };

    render() {
        return (
            <div>
                <Tabs value={this.state.tabIndex}
                      onChange={this._handleTabChange}
                      indicatorColor="primary"
                      variant="fullWidth">
                    <Tab label={I18n.t('js.user.settings.article.title')}
                         disableRipple={true}/>

                    <Tab label={I18n.t('js.user.settings.tag.title')}
                         disableRipple={true}/>

                    <Tab label={I18n.t('js.user.settings.search.title')}
                         disableRipple={true}/>
                </Tabs>

                {
                    this.state.tabIndex === 0 &&
                    <div className="row margin-top-15">
                        <div className="col s12">
                            <FormControl className="margin-top-20"
                                         component="fieldset">
                                <FormLabel component="legend">
                                    {I18n.t('js.user.settings.article.loader.title')}
                                </FormLabel>
                                <RadioGroup aria-label="Loader"
                                            name="loader"
                                            value={this.state.articlesLoader}
                                            onChange={this._onSettingRadioChange.bind(this, 'articlesLoader')}>
                                    {
                                        Object.keys(I18n.t('js.user.settings.article.loader.mode')).map((key) => (
                                            <FormControlLabel key={key}
                                                              value={key}
                                                              control={<Radio/>}
                                                              label={I18n.t('js.user.settings.article.loader.mode')[key]}/>
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        </div>

                        <div className="col s12 margin-top-15">
                            <FormControl className="margin-top-20"
                                         component="fieldset">
                                <FormLabel component="legend">
                                    {I18n.t('js.user.settings.article.display.title')}
                                </FormLabel>
                                <RadioGroup aria-label="Display article"
                                            name="loader"
                                            value={this.state.articleDisplay}
                                            onChange={this._onSettingRadioChange.bind(this, 'articleDisplay')}>
                                    {
                                        Object.keys(I18n.t('js.user.settings.article.display.mode')).map((key) => (
                                            <FormControlLabel key={key}
                                                              value={key}
                                                              control={<Radio/>}
                                                              label={I18n.t('js.user.settings.article.display.mode')[key]}/>
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                }

                {
                    this.state.tabIndex === 1 &&
                    <div className="row margin-top-15">
                        <div className="col s12">
                            <FormLabel component="legend">
                                {I18n.t('js.user.settings.tag.sidebar.title')}
                            </FormLabel>

                            <FormControlLabel label={I18n.t('js.user.settings.tag.sidebar.pin')}
                                              control={
                                                  <Switch checked={this.state.tagSidebarPin}
                                                          onChange={this._onSettingSwitchChange.bind(this, 'tagSidebarPin')}/>
                                              }/>

                            <FormControlLabel label={I18n.t('js.user.settings.tag.sidebar.with_child')}
                                              control={
                                                  <Switch checked={this.state.tagSidebarWithChild}
                                                          onChange={this._onSettingSwitchChange.bind(this, 'tagSidebarWithChild')}/>
                                              }/>

                            <FormControlLabel label={I18n.t('js.user.settings.tag.parent_and_child')}
                                              control={
                                                  <Switch checked={this.state.tagParentAndChild}
                                                          onChange={this._onSettingSwitchChange.bind(this, 'tagParentAndChild')}/>
                                              }/>

                        </div>

                        <div className="col s12 margin-top-15">
                            <FormControl className="margin-top-20"
                                         component="fieldset">
                                <FormLabel component="legend">
                                    {I18n.t('js.user.settings.tag.order.title')}
                                </FormLabel>
                                <RadioGroup aria-label="Tag order"
                                            name="loader"
                                            value={this.state.tagOrder}
                                            onChange={this._onSettingRadioChange.bind(this, 'tagOrder')}>
                                    {
                                        Object.keys(I18n.t('js.user.settings.tag.order.mode')).map((key) => (
                                            <FormControlLabel key={key}
                                                              value={key}
                                                              control={<Radio/>}
                                                              label={I18n.t('js.user.settings.tag.order.mode')[key]}/>
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                }

                {
                    this.state.tabIndex === 2 &&
                    <div className="row margin-top-15">
                        <div className="col s12">
                            <FormControl className="margin-top-20"
                                         component="fieldset">
                                <FormLabel component="legend">
                                    {I18n.t('js.user.settings.search.operator.title')}
                                </FormLabel>
                                <RadioGroup aria-label="Search operand"
                                            name="loader"
                                            value={this.state.searchOperator}
                                            onChange={this._onSettingRadioChange.bind(this, 'searchOperator')}>
                                    {
                                        Object.keys(I18n.t('js.user.settings.search.operator.mode')).map((key) => (
                                            <FormControlLabel key={key}
                                                              value={key}
                                                              control={<Radio/>}
                                                              label={I18n.t('js.user.settings.search.operator.mode')[key]}/>
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        </div>

                        <div className="col s12 margin-top-15">
                            <FormLabel component="legend">
                                {I18n.t('js.user.settings.search.options')}
                            </FormLabel>
                            <FormControlLabel label={I18n.t('js.user.settings.search.highlight')}
                                              control={
                                                  <Switch checked={this.state.searchHighlight}
                                                          onChange={this._onSettingSwitchChange.bind(this, 'searchHighlight')}/>
                                              }/>
                        </div>

                        <div className="col s12 margin-top-15">
                            <FormControlLabel label={I18n.t('js.user.settings.search.exact')}
                                              control={
                                                  <Switch checked={this.state.searchExact}
                                                          onChange={this._onSettingSwitchChange.bind(this, 'searchExact')}/>
                                              }/>
                        </div>
                    </div>
                }
            </div>
        )
            ;
    }
}
