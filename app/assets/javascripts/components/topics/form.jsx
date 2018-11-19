'use strict';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

export default class FormTopic extends React.Component {
    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired,
        defaultVisibility: PropTypes.string,
        topic: PropTypes.object,
        isEditing: PropTypes.bool
    };

    static defaultProps = {
        defaultVisibility: 'only_me',
        topic: {},
        isEditing: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        name: this.props.isEditing ? this.props.topic.name : '',
        visibility: this.props.isEditing ? this.props.topic.visibility : this.props.defaultVisibility
    };

    _handleNameChange = (event) => {
        this.setState({
            name: event.target.value
        });
    };

    _handleVisibilityChange = (event) => {
        this.setState({
            visibility: event.target.value
        });
    };

    _handleTopicSubmit = (event) => {
        event.preventDefault();

        this.props.onSubmit(this.state.name, this.state.visibility);
    };

    _handleTopicDelete = (event) => {
        event.preventDefault();

        this.props.onDelete(this.props.topic.id);
    };

    render() {
        return (
            <form id="topic-edit"
                  className="topic-form"
                  onSubmit={this._handleTopicSubmit}>
                <TextField style={{margin: 8}}
                           fullWidth={true}
                           autoFocus={true}
                           label={this.props.isEditing
                               ?
                               I18n.t('js.topic.edit.input')
                               :
                               I18n.t('js.topic.new.input')}
                           variant="outlined"
                           value={this.state.name}
                           onChange={this._handleNameChange}/>

                <TextField select={true}
                           style={{margin: 8}}
                           fullWidth={true}
                           label={I18n.t('js.topic.model.visibility')}
                           value={this.state.visibility}
                           onChange={this._handleVisibilityChange}
                           variant="outlined">
                    {
                        Object.keys(I18n.t('js.topic.enums.visibility')).map((key) => (
                            <MenuItem key={key}
                                      value={key}>
                                {I18n.t('js.topic.enums.visibility')[key]}
                            </MenuItem>
                        ))
                    }
                </TextField>

                <div className="center-align margin-top-20">
                    <Button color="primary"
                            variant="outlined"
                            onClick={this._handleTopicSubmit}>
                        {
                            this.props.isEditing
                                ?
                                I18n.t('js.topic.edit.submit')
                                :
                                I18n.t('js.topic.new.submit')
                        }
                    </Button>

                    {
                        this.props.isEditing &&
                        <div className="center-align margin-top-15">
                            <a href="#"
                               onClick={this._handleTopicDelete}>
                                {I18n.t('js.topic.edit.delete')}
                            </a>
                        </div>
                    }

                    <div className="center-align margin-top-15">
                        <a href="#"
                           onClick={this.props.onCancel}>
                            {I18n.t('js.topic.new.cancel')}
                        </a>
                    </div>
                </div>
            </form>
        );
    }
}