'use strict';

import {
    lazy,
    Suspense
} from 'react';

import {
    withRouter,
    Route,
    Link
} from 'react-router-dom';

import {
    ImmutableLoadingBar as LoadingBar
} from 'react-redux-loading-bar';

import {
    withStyles
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ClassIcon from '@material-ui/icons/Class';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AddIcon from '@material-ui/icons/Add';

import {
    getLocalData
} from '../../../middlewares/localStorage';

import {
    showUserPreference,
    showTopicPopup
} from '../../../actions';

import {
    getCurrentTagSlugs
} from '../../../selectors';

const Preference = lazy(() => import(/* webpackChunkName: "user-preference" */ '../../users/preference'));

import TopicModule from '../../topics/module';

import BookmarkList from '../../bookmark/list';

import TagSidebar from '../../tags/sidebar';

import ArticleSidebar from '../../articles/sidebar';

const HomeSearchHeader = lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "search-header" */ '../header/search'));
import HomeBookmarkHeader from '../header/bookmark';
import HomeArticleHeader from '../header/article';
import HomeUserHeader from '../header/user';

import HeaderUserMenu from '../header/menus/user';
import HeaderArticleMenu from '../header/menus/article';

import styles from '../../../../jss/user/header';

import {
    articleTemporaryDataName
} from '../../modules/constants';

export default @withRouter
@connect((state) => ({
    isUserPreferenceOpen: state.uiState.isUserPreferenceOpen,
    isTopicPopupOpen: state.uiState.isTopicPopupOpen,
    isUserConnected: state.userState.isConnected,
    isUserLoaded: state.userState.isLoaded,
    isAdminConnected: state.userState.isAdminConnected,
    userSlug: state.userState.currentSlug,
    topicSlug: state.topicState.currentUserTopicSlug,
    currentTopic: state.topicState.currentTopic,
    currentTagSlugs: getCurrentTagSlugs(state)
}), {
    showUserPreference,
    showTopicPopup
})
@withStyles(styles)
class HeaderLayoutUser extends React.PureComponent {
    static propTypes = {
        permanentRoutes: PropTypes.array.isRequired,
        // from router
        location: PropTypes.object,
        match: PropTypes.object,
        history: PropTypes.object,
        // from connect
        isUserPreferenceOpen: PropTypes.bool,
        isTopicPopupOpen: PropTypes.bool,
        isUserConnected: PropTypes.bool,
        isUserLoaded: PropTypes.bool,
        isAdminConnected: PropTypes.bool,
        userSlug: PropTypes.string,
        topicSlug: PropTypes.string,
        currentTopic: PropTypes.object,
        currentTagSlugs: PropTypes.array,
        showUserPreference: PropTypes.func,
        showTopicPopup: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this._anchorEl = null;

        // Check if temporary article in local storage
        const temporaryArticle = getLocalData(articleTemporaryDataName);
        if (temporaryArticle && temporaryArticle.length > 0) {
            this.state.hasTemporaryArticle = true;
        }
    }

    state = {
        isMobileTagSidebarOpen: false,
        isMobileArticleSidebarOpen: false,
        isMobileBookmarkOpen: false,
        isMobileArticleOpen: false,
        isMobileUserOpen: false,
        hasTemporaryArticle: false
    };

    componentDidMount() {
        $(document).keyup((event) => {
            if (Utils.NAVIGATION_KEYMAP[event.which] === 'escape') {
                this._handleSearchClose();
            }
        });
    }

    _handleSearchOpen = () => {
        if (this.props.location.hash !== '#search') {
            this.props.history.push({
                hash: 'search'
            });
        }
    };

    _handleSearchClose = () => {
        if (this.props.location.hash === '#search') {
            this.props.history.push({
                hash: undefined
            });
        }
    };

    _handleTagDrawerToggle = () => {
        this.setState(state => ({isMobileTagSidebarOpen: !state.isMobileTagSidebarOpen}));
    };

    _handleArticleDrawerToggle = () => {
        this.setState(state => ({isMobileArticleSidebarOpen: !state.isMobileArticleSidebarOpen}));
    };

    _handleMobileBookmarkClick = () => {
        this.setState((state) => ({isMobileBookmarkOpen: !state.isMobileBookmarkOpen}));
    };

    _handleMobileArticleClick = () => {
        this.setState((state) => ({isMobileArticleOpen: !state.isMobileArticleOpen}));
    };

    _handleMobileUserClick = () => {
        this.setState((state) => ({isMobileUserOpen: !state.isMobileUserOpen}));
    };

    _handleTopicOpen = () => {
        this.props.showTopicPopup(true);
    };

    _handleTopicClose = () => {
        this.props.showTopicPopup(false);
    };

    _handlePreferenceClick = () => {
        this.props.showUserPreference();
    };

    _renderPermanentRoutes = (routes) => {
        return routes.map((route, index) => (
            <Route key={index}
                   children={({match, location, history}) => {
                       const Component = route.component();

                       return (
                           <div>
                               {
                                   location.hash === `#${route.path}` &&
                                   <Component params={match.params}
                                              history={history}
                                              initialData={location.state}/>
                               }
                           </div>
                       );
                   }}/>
        ));
    };

    _renderDesktopMenu = () => {
        return (
            <div className={this.props.classes.sectionDesktop}>
                <HomeArticleHeader userSlug={this.props.userSlug}
                                   topicSlug={this.props.topicSlug}
                                   currentTagSlugs={this.props.currentTagSlugs}
                                   hasTemporaryArticle={this.state.hasTemporaryArticle}/>

                <HomeBookmarkHeader/>

                <HomeUserHeader isUserConnected={this.props.isUserConnected}
                                isAdminConnected={this.props.isAdminConnected}
                                onPreferenceClick={this._handlePreferenceClick}
                                userSlug={this.props.userSlug}/>
            </div>
        );
    };

    _renderMobileTagDrawer = () => {
        return (
            <Hidden mdUp={true}>
                <SwipeableDrawer variant="temporary"
                                 anchor="left"
                                 classes={{
                                     paper: this.props.classes.mobileDrawerPaper
                                 }}
                                 ModalProps={{
                                     keepMounted: true
                                 }}
                                 open={this.state.isMobileTagSidebarOpen}
                                 onClose={this._handleTagDrawerToggle}
                                 onOpen={this._handleTagDrawerToggle}>
                    <div>
                        <div className={this.props.classes.mobileToolbar}>
                            <Link to="/">
                                <Typography variant="h5">
                                    {I18n.t('js.views.header.title')}
                                </Typography>
                            </Link>
                        </div>

                        <List>
                            <ListItem button={true}
                                      onClick={this._handleMobileArticleClick}>
                                <ListItemIcon>
                                    <AddIcon/>
                                </ListItemIcon>
                                <ListItemText inset={true}
                                              primary="Articles"/>
                                {this.state.isMobileArticleOpen ? <ExpandLess/> : <ExpandMore/>}
                            </ListItem>
                            <Collapse in={this.state.isMobileArticleOpen}
                                      timeout="auto"
                                      unmountOnExit={true}>
                                <HeaderArticleMenu classes={this.props.classes}
                                                   isNested={true}
                                                   match={this.props.match}
                                                   userSlug={this.props.userSlug}
                                                   currentTagSlugs={this.props.currentTagSlugs}
                                                   topicSlug={this.props.topicSlug}
                                                   hasTemporaryArticle={this.state.hasTemporaryArticle}/>
                            </Collapse>

                            <ListItem button={true}
                                      onClick={this._handleMobileBookmarkClick}>
                                <ListItemIcon>
                                    <FavoriteIcon/>
                                </ListItemIcon>
                                <ListItemText inset={true}
                                              primary="Favoris"/>
                                {this.state.isMobileBookmarkOpen ? <ExpandLess/> : <ExpandMore/>}
                            </ListItem>
                            <Collapse in={this.state.isMobileBookmarkOpen}
                                      timeout="auto"
                                      unmountOnExit={true}>
                                <BookmarkList/>
                            </Collapse>

                            <ListItem button={true}
                                      onClick={this._handleMobileUserClick}>
                                <ListItemIcon>
                                    <AccountCircleIcon/>
                                </ListItemIcon>
                                <ListItemText inset={true}
                                              primary="Votre compte"/>
                                {this.state.isMobileUserOpen ? <ExpandLess/> : <ExpandMore/>}
                            </ListItem>
                            <Collapse in={this.state.isMobileUserOpen}
                                      timeout="auto"
                                      unmountOnExit={true}>
                                <HeaderUserMenu classes={this.props.classes}
                                                isNested={true}
                                                userSlug={this.props.userSlug}
                                                onPreferenceClick={this._handlePreferenceClick}/>
                            </Collapse>
                        </List>

                        <Divider/>

                        <TagSidebar isOpen={true}/>
                    </div>
                </SwipeableDrawer>
            </Hidden>
        );
    };

    _renderMobileArticleDrawer = () => {
        return (
            <Hidden mdUp={true}>
                <SwipeableDrawer variant="temporary"
                                 anchor="right"
                                 classes={{
                                     paper: this.props.classes.mobileDrawerPaper
                                 }}
                                 ModalProps={{
                                     keepMounted: true
                                 }}
                                 open={this.state.isMobileArticleSidebarOpen}
                                 onClose={this._handleArticleDrawerToggle}
                                 onOpen={this._handleArticleDrawerToggle}>
                    <ArticleSidebar/>
                </SwipeableDrawer>
            </Hidden>
        );
    };

    render() {
        const isSearchActive = this.props.location.hash === '#search';

        return (
            <>
                <AppBar position="fixed"
                        className={classNames('animate-search', this.props.classes.appBar)}>
                    <LoadingBar showFastActions={true}
                                style={{backgroundColor: '#233348', height: '2px'}}/>

                    <Toolbar className={classNames(this.props.classes.toolbar)}>
                        <div className={this.props.classes.sectionMobile}>
                            <IconButton className={this.props.classes.menuButton}
                                        color="primary"
                                        aria-label="Open drawer"
                                        onClick={this._handleDrawerToggle}>
                                <MenuIcon/>
                            </IconButton>

                            <Link className={this.props.classes.title}
                                  to="/">
                                <h1 className={this.props.classes.websiteTitle}>
                                    InR
                                </h1>
                            </Link>
                        </div>

                        {
                            (this.props.isUserLoaded && this.props.currentTopic) &&
                            <>
                                <Button buttonRef={(ref) => this._anchorEl = ref}
                                        className={this.props.classes.topicButton}
                                        variant="contained"
                                        color="primary"
                                        onClick={this._handleTopicOpen}>
                                    <span className={this.props.classes.sectionDesktop}>
                                        {I18n.t('js.views.header.topic.button', {current: this.props.currentTopic.name})}
                                    </span>

                                    <span className={this.props.classes.sectionMobile}>
                                        <ClassIcon/>
                                    </span>
                                </Button>

                                <Popover open={this.props.isTopicPopupOpen}
                                         anchorEl={this._anchorEl}
                                    // anchorPosition={{top: 200, left: 400}}
                                         elevation={6}
                                         onClose={this._handleTopicClose}
                                         anchorOrigin={{
                                             vertical: 'bottom',
                                             horizontal: 'left',
                                         }}
                                         transformOrigin={{
                                             vertical: 'top',
                                             horizontal: 'center',
                                         }}>
                                    <TopicModule onClose={this._handleTopicClose}/>
                                </Popover>
                            </>
                        }

                        <div className={this.props.classes.sectionDesktop}>
                            <Link to="/">
                                <h1 className={this.props.classes.title}>
                                    {I18n.t('js.views.header.title')}
                                </h1>
                            </Link>
                        </div>

                        <div className={this.props.classes.grow}/>

                        <Suspense fallback={<div/>}>
                            <HomeSearchHeader isSearchActive={isSearchActive}
                                              onFocus={this._handleSearchOpen}
                                              onClose={this._handleSearchClose}/>
                        </Suspense>

                        <div className={this.props.classes.grow}/>

                        {this._renderDesktopMenu()}
                    </Toolbar>

                    <div className={classNames('search-module', {
                        'is-visible': isSearchActive
                    })}>
                        {
                            isSearchActive &&
                            <Suspense fallback={<div/>}>
                                {this._renderPermanentRoutes(this.props.permanentRoutes)}
                            </Suspense>
                        }
                    </div>
                </AppBar>

                {this._renderMobileTagDrawer()}

                {this._renderMobileArticleDrawer()}

                <div id="clipboard-area"
                     className="hidden">
                    <textarea id="clipboard"
                              title="clipboard"/>
                </div>

                <Suspense fallback={<div/>}>
                    <Preference isOpen={this.props.isUserPreferenceOpen}
                                onModalChange={this.props.showUserPreference}/>
                </Suspense>
            </>
        );
    }
}
