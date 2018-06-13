'use strict';

import {
    initUser,
    fetchTopics,
    fetchTags,
    getTracksClick,
    fetchUserRecents,
    updateUserRecents,
    setCurrentTags
} from '../../../actions';

@connect((state) => ({
    isUserConnected: state.userState.isConnected,
    currentUserId: state.userState.currentId,
    currentTopicId: state.topicState.currentTopicId
}), {
    initUser,
    fetchTopics,
    fetchTags,
    fetchUserRecents,
    updateUserRecents,
    setCurrentTags
})
export default class UserManager extends React.Component {
    static propTypes = {
        children: PropTypes.object.isRequired,
        routerState: PropTypes.object,
        // From connect
        isUserConnected: PropTypes.bool,
        currentUserId: PropTypes.number,
        currentTopicId: PropTypes.number,
        initUser: PropTypes.func,
        fetchTopics: PropTypes.func,
        fetchTags: PropTypes.func,
        fetchUserRecents: PropTypes.func,
        updateUserRecents: PropTypes.func,
        setCurrentTags: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // Called each time a route changed!

        // Reset current tags
        this.props.setCurrentTags();

        // Load user environment if connected
        if (this.props.isUserConnected) {
            // Get current user details with current topic
            this.props.initUser(this.props.currentUserId, {userProfile: true})
                .fetch.then((response) => {
                if (response && response.user) {
                    // Get all user topics
                    this.props.fetchTopics(this.props.currentUserId);

                    // Loaded when current topic is updated
                    // Get all user tags for current topic (user private and common public tags associated to his articles)
                    // props.fetchTags({topicId: response.user.currentTopic.id});

                    Utils.defer.then(() => {
                        // Send local recent clicks otherwise fetch them
                        const userJustSign = sessionStorage && sessionStorage.getItem('user-connection');
                        if (userJustSign) {
                            sessionStorage.removeItem('user-connection');
                            this.props.updateUserRecents(this.props.currentUserId, getTracksClick(true));
                        } else {
                            this.props.fetchUserRecents(this.props.currentUserId, {limit: 10});
                        }
                    });
                }

                if (this.props.currentTopicId || (this.props.routerState && this.props.routerState.reloadTags)) {
                    this.props.fetchTags({topicId: this.props.currentTopicId}, {}, {topicTags: true});
                }
            });
        } else {
            // Get only all public tags
            this.props.fetchTags({
                visibility: 'everyone'
            }, {
                limit: 200
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.currentTopicId !== prevProps.currentTopicId || (prevProps.routerState && prevProps.routerState.reloadTags)) {
            this.props.fetchTags({topicId: this.props.currentTopicId});
        }
    }

    render() {
        return React.Children.only(this.props.children);
    }
}
