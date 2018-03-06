'use strict';

// Keyboard inputs
import MouseTrap from 'mousetrap';

import {
    switchUserLogin,
    switchUserPreference
} from '../../../actions';

@connect((state) => ({
    isUserConnected: state.userState.isConnected,
    currentUserId: state.userState.currentId
}), {
    switchUserLogin,
    switchUserPreference
})
export default class HotkeyManager extends React.Component {
    static propTypes = {
        children: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        // From connect
        isUserConnected: PropTypes.bool,
        currentUserId: PropTypes.number,
        switchUserLogin: PropTypes.func,
        switchUserPreference: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this._setHotkeys();
    }

    _setHotkeys = () => {
        Mousetrap.bind('alt+a', (event) => {
            event.preventDefault();
            this.props.history.push('/article/new');
        }, 'keydown');

        Mousetrap.bind('alt+l', (event) => {
            event.preventDefault();
            this.props.switchUserLogin();
        }, 'keydown');

        Mousetrap.bind('alt+s', (event) => {
            event.preventDefault();
            this.props.history.push({
                hash: 'search'
            });
        }, 'keydown');

        Mousetrap.bind('alt+p', (event) => {
            event.preventDefault();
            this.props.switchUserPreference();
        }, 'keydown');
    };

    render() {
        return React.Children.only(this.props.children);
    }
}