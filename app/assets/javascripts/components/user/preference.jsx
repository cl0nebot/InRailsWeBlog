var UserActions = require('../../actions/userAction');
var UserStore = require('../../stores/userStore');
var RadioButtons = require('../../components/materialize/radioButtons');
var Checkbox = require('../../components/materialize/switch');

var UserPreference = React.createClass({
    mixins: [
        Reflux.listenTo(UserStore, 'onChangePreference')
    ],

    getInitialState: function () {
        return {
            article_display: 'inline',
            multi_language: false,
            search_highlight: true,
            search_operator: 'and',
            search_exact: false,
            $userPrefDiv: null
        };
    },

    componentDidMount: function () {
        $('a#toggle-user-pref').click(function (event) {
            event.preventDefault();

            this.state.$userPrefDiv = $('.blog-user-pref');

            if (this.state.$userPrefDiv.is(":visible")) {
                this.state.$userPrefDiv.slideUp();
            } else {
                $('.button-collapse').sideNav('hide');
                this.state.$userPrefDiv.slideDown(150, function () {
                    $('.user-pref-collapsible').collapsible({
                        accordion: true
                    });
                }.bind(this));
            }

            this.state.$userPrefDiv.mouseleave(function() {
                this.state.$userPrefDiv.slideUp();
            }.bind(this));

            return false;
        }.bind(this));
    },

    onChangePreference(userStore) {
        var userPreferences = userStore.preferences;
        if (!$.isEmpty(userPreferences)) {
            var newState = {};

            if (userPreferences.article_display) {
                newState.article_display = userPreferences.article_display;
            }
            if (userPreferences.multi_language) {
                newState.multi_language = userPreferences.multi_language;
            }
            if (userPreferences.search_highlight) {
                newState.search_highlight = userPreferences.search_highlight;
            }
            if (userPreferences.search_operator) {
                newState.search_operator = userPreferences.search_operator;
            }
            if (userPreferences.search_exact) {
                newState.search_exact = userPreferences.search_exact;
            }

            this.setState(newState);
        }
    },

    _onDisplayChanged: function (event) {
        var article_display = event.target.id;
        this.setState({article_display: event.target.id});
        UserActions.changeDisplay(article_display);
    },

    _onMultiLanguageChanged: function (event) {
        var multi_language = this.refs.multiLanguage.refs.checkbox.checked;
        this.setState({multi_language: multi_language});
        UserActions.changeForm({multi_language: multi_language});
    },

    _onHighlightChanged: function (event) {
        var search_highlight = this.refs.searchHighlight.refs.checkbox.checked;
        this.setState({search_highlight: search_highlight});
        UserActions.changeSearchOptions({search_highlight: search_highlight});
    },

    _onOperatorSearchChanged: function (event) {
        var search_operator = event.target.id;
        this.setState({search_operator: search_operator});
        UserActions.changeSearchOptions({search_operator: search_operator});
    },

    _onExactSearchChanged: function (event) {
        var search_exact = this.refs.searchExact.refs.checkbox.checked;
        this.setState({search_exact: search_exact});
        UserActions.changeSearchOptions({search_exact: search_exact});
    },

    render: function () {
        return (
            <div className="container center">
                <ul data-collapsible="accordion" className="collapsible popout user-pref-collapsible">
                    <li>
                        <div className="collapsible-header"><i className="material-icons">list</i>
                            {I18n.t('js.user.preferences.article.title')}
                        </div>
                        <div className="collapsible-body">
                            <div className="row">
                                <div className="col s6">
                                    <h6>{I18n.t('js.user.preferences.article.display.title')}</h6>
                                    <RadioButtons group="articleDisplay"
                                                  buttons={I18n.t('js.user.preferences.article.display.mode')}
                                                  checkedButton={this.state.article_display}
                                                  onRadioChanged={this._onDisplayChanged}/>
                                </div>
                                <div className="col s6">
                                    <h6>{I18n.t('js.user.preferences.article.multi_language.title')}</h6>
                                    <Checkbox ref="multiLanguage"
                                              values={I18n.t('js.checkbox')}
                                              checked={this.state.multi_language}
                                              onCheckboxChanged={this._onMultiLanguageChanged}/>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="collapsible-header"><i className="material-icons">view_modules</i>
                            {I18n.t('js.user.preferences.search.title')}
                        </div>
                        <div className="collapsible-body">
                            <div className="row">
                                <div className="col s4">
                                    <h6>{I18n.t('js.user.preferences.search.operator.title')}</h6>
                                    <RadioButtons group="searchOperator"
                                                  buttons={I18n.t('js.user.preferences.search.operator.mode')}
                                                  checkedButton={this.state.search_operator}
                                                  onRadioChanged={this._onOperatorSearchChanged}/>
                                </div>
                                <div className="col s4">
                                    <h6>{I18n.t('js.user.preferences.search.highlight')}</h6>
                                    <Checkbox ref="searchHighlight"
                                              values={I18n.t('js.checkbox')}
                                              checked={this.state.search_highlight}
                                              onCheckboxChanged={this._onHighlightChanged}/>
                                </div>
                                <div className="col s4">
                                    <h6>{I18n.t('js.user.preferences.search.exact')}</h6>
                                    <Checkbox ref="searchExact"
                                              values={I18n.t('js.checkbox')}
                                              checked={this.state.search_exact}
                                              onCheckboxChanged={this._onExactSearchChanged}/>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
});


module.exports = UserPreference;
