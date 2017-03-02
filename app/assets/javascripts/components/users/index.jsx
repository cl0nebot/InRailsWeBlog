'use strict';

import UserActions from '../../actions/userActions';
import UserStore from '../../stores/userStore';

import UserCardDisplay from './display/card';

import SearchBar from '../theme/search-bar';

import Filtering from '../../modules/filter';

import Pagination from '../materialize/pagination';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class UserIndex extends Reflux.Component {
    static propTypes = {
        onUserClick: React.PropTypes.func
    };

    static defaultProps = {
        onUserClick: null
    };

    state = {
        users: [],
        usersPagination: null,
        filteredUsers: null
    };

    constructor(props) {
        super(props);

        this.mapStoreToState(UserStore, this.onUserChange);
    }

    componentWillMount() {
        UserActions.loadUsers({page: 1});
    }

    onUserChange(userData) {
        if ($.isEmpty(userData)) {
            return;
        }

        let newState = {};

        if (typeof(userData.users) !== 'undefined') {
            newState.users = userData.users;
            newState.usersPagination = userData.meta;
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    }

    _handleUserInput(filterText) {
        let filteredUsers = Filtering.filterArrayOfObject(this.state.users, 'pseudo', filterText);

        this.setState({
            filterText: filterText,
            filteredUsers: filteredUsers
        });
    }

    _handleUserClick(userId, event) {
        if (this.props.onUserClick) {
            if (event) {
                event.preventDefault();
            }

            this.props.onUserClick(userId);
        } else {
            return event;
        }
    }

    _handlePaginationClick(paginate) {
        UserActions.loadUsers({page: paginate.selected + 1});
        setTimeout(() => {
            $('html, body').animate({scrollTop: $('.blog-user-list').offset().top - 64}, 750);
        }, 300);
    }

    render() {
        let users = this.state.filteredUsers ? this.state.filteredUsers : this.state.users;

        return (
            <div className="blog-user">
                <div className="row">
                    <div className="col s12">
                        <div className="card-panel">
                            <SearchBar label={I18n.t('js.user.index.search')}
                                       onUserInput={this._handleUserInput}>
                                {this.state.filterText}
                            </SearchBar>
                        </div>
                    </div>
                </div>

                <div className="row blog-user-list">
                    <ReactCSSTransitionGroup transitionName="user"
                                             transitionAppear={true}
                                             transitionAppearTimeout={600}
                                             transitionEnterTimeout={500}
                                             transitionLeaveTimeout={300}>
                        {
                            users.map((user) =>
                                <div key={user.id}
                                     className="col s6 m4 l3 ">
                                    <UserCardDisplay user={user}
                                                     onUserClick={this._handleUserClick}/>
                                </div>
                            )

                        }
                    </ReactCSSTransitionGroup>

                    {
                        this.state.usersPagination &&
                        <Pagination totalPages={this.state.usersPagination.total_pages}
                                    onPaginationClick={this._handlePaginationClick}/>
                    }
                </div>
            </div>
        );
    }
}
