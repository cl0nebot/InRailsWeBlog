'use strict';

import {
    hot
} from 'react-hot-loader';

import {
    withStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';

import {
    validateUser,
    shareTopic
} from '../../actions';

import {
    getSharingTopic
} from '../../selectors';

import ShareFormTopic from './share/form';

import styles from '../../../jss/topic/share';

export default @connect((state, props) => ({
    userId: state.userState.currentId,
    userSlug: state.userState.currentSlug,
    sharingTopic: getSharingTopic(state, props.initialData)
}), {
    shareTopic
})
@hot(module)
@withStyles(styles)
class TopicModal extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        // from connect
        sharingTopic: PropTypes.object,
        shareTopic: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    state = {
        isOpen: true,
        errorText: null
    };

    _handleClose = () => {
        this.setState({
            isOpen: false
        });

        this.props.history.push({
            hash: undefined
        });
    };

    _handleUserChange = (userLogin) => {
        validateUser(userLogin).then((response) => {
            if (!response.success) {
                this.setState({
                    errorText: I18n.t('js.topic.share.errors.unknown')
                });
            } else {
                this.setState({
                    errorText: null
                });
            }
        })
    };

    _handleShareSubmit = (userLogin) => {
        if(Utils.isEmpty(userLogin)) {
            this.setState({
                errorText: I18n.t('js.topic.share.errors.user_empty')
            });
        } else {
            this.props.shareTopic(this.props.sharingTopic.id, userLogin)
            .then((response) => {
                if (!response.errors) {
                    this._handleClose();
                }
            });
        }
    };

    render() {
        return (
            <Modal open={this.state.isOpen}
                   onClose={this._handleClose}>
                <div className={this.props.classes.modal}>
                    <Typography variant="h6">
                        {I18n.t('js.topic.share.title')}
                    </Typography>

                    <ShareFormTopic classes={this.props.classes}
                                    errorText={this.state.errorText}
                                    onUserChange={this._handleUserChange}
                                    onCancel={this._handleClose}
                                    onShare={this._handleShareSubmit}/>
                </div>
            </Modal>
        );
    }
}
