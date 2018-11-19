'use strict';

import {
    hot
} from 'react-hot-loader';

import {
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import {
    spyTrackClick
} from '../../actions';

import {
    getUser,
    getPublicTopics,
    getPrivateTopics
} from '../../selectors';

import Loader from '../theme/loader';

import NotFound from '../layouts/notFound';

import styles from '../../../jss/user/home';

export default @hot(module)

@connect((state) => ({
    isFetching: state.userState.isFetching,
    user: getUser(state),
    publicTopics: getPublicTopics(state),
    privateTopics: getPrivateTopics(state)
}))
@withStyles(styles)
class UserHome extends React.Component {
    static propTypes = {
        // from connect
        isFetching: PropTypes.bool,
        user: PropTypes.object,
        publicTopics: PropTypes.array,
        privateTopics: PropTypes.array,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    _handleTopicClick = (topic) => {
        spyTrackClick('topic', topic.id, topic.slug)
    };

    render() {
        if (!this.props.user) {
            if (this.props.isFetching) {
                return (
                    <div className="center margin-top-20">
                        <Loader size="big"/>
                    </div>
                )
            } else {
                return (
                    <div className="center margin-top-20">
                        <NotFound/>
                    </div>
                )
            }
        }

        return (
            <div className={this.props.classes.root}>
                <Card component="section"
                      className={this.props.classes.card}
                      elevation={6}>
                    <CardHeader classes={{
                        root: this.props.classes.header
                    }}
                                title={I18n.t('js.user.home.private.title')}
                                subheader={I18n.t('js.user.home.private.subtitle')}/>

                    <CardContent classes={{
                        root: this.props.classes.content
                    }}>
                        <Grid container={true}
                              spacing={32}
                              direction="row"
                              justify="flex-start"
                              alignItems="center">
                            {
                                this.props.privateTopics.map((topic) => (
                                    <Grid key={topic.id}
                                          item={true}
                                          xs={12}
                                          sm={6}
                                          lg={4}>
                                        <Link to={`/users/${this.props.user.slug}/topics/${topic.slug}`}
                                              onClick={this._handleTopicClick.bind(this, topic)}>
                                            <Paper className={this.props.classes.theme}
                                                   elevation={1}>
                                                <Typography className={this.props.classes.themeTitle}
                                                            variant="h5"
                                                            component="h2">
                                                    {topic.name}
                                                </Typography>

                                                <Typography component="p">
                                                    {topic.description}
                                                </Typography>
                                            </Paper>
                                        </Link>
                                    </Grid>
                                ))
                            }

                            <Grid item={true}
                                  xs={12}
                                  sm={6}
                                  lg={4}>
                                <Link to={{
                                    hash: '#new-topic',
                                    state: {
                                        visibility: 'only_me'
                                    }
                                }}>
                                    <Paper className={this.props.classes.themeNew}
                                           elevation={1}>
                                        <Typography className={this.props.classes.themeNewTitle}
                                                    variant="h5"
                                                    component="h2">
                                            {I18n.t('js.user.home.add_topic')}
                                        </Typography>
                                    </Paper>
                                </Link>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Card component="section"
                      className={this.props.classes.card}
                      elevation={5}>
                    <CardHeader classes={{
                        root: this.props.classes.header
                    }}
                                title={I18n.t('js.user.home.public.title')}
                                subheader={I18n.t('js.user.home.public.subtitle')}/>

                    <CardContent classes={{
                        root: this.props.classes.content
                    }}>
                        <Grid container={true}
                              spacing={32}
                              direction="row"
                              justify="flex-start"
                              alignItems="center">
                            {
                                this.props.publicTopics.map((topic) => (
                                    <Grid key={topic.id}
                                          item={true}
                                          xs={12}
                                          sm={6}
                                          lg={4}>
                                        <Link to={`/users/${this.props.user.slug}/topics/${topic.slug}`}
                                              onClick={this._handleTopicClick.bind(this, topic)}>
                                            <Paper className={this.props.classes.theme}
                                                   elevation={1}>
                                                <Typography className={this.props.classes.themeTitle}
                                                            variant="h5"
                                                            component="h2">
                                                    {topic.name}
                                                </Typography>

                                                <Typography component="p">
                                                    {topic.description}
                                                </Typography>
                                            </Paper>
                                        </Link>
                                    </Grid>
                                ))
                            }

                            <Grid item={true}
                                  xs={12}
                                  sm={6}
                                  lg={4}>
                                <Link to={{
                                    hash: '#new-topic',
                                    state: {
                                        visibility: 'everyone'
                                    }
                                }}>
                                    <Paper className={this.props.classes.themeNew}
                                           elevation={1}>
                                        <Typography className={this.props.classes.themeNewTitle}
                                                    variant="h5"
                                                    component="h2">
                                            {I18n.t('js.user.home.add_topic')}
                                        </Typography>
                                    </Paper>
                                </Link>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </div>
        );
    }
}