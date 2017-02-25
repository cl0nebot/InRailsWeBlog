'use strict';

const UserStore = require('../../../stores/userStore');

import {Link} from 'react-router';

const UserAvatarIcon = ({user, className}) => (
    <Link className={className}
          to={`/user/profile/${user.slug}`}
          onClick={(event) => {
              UserAvatarIcon._handleAuthorClick(user.id, event)
          }}>
        <div className="chip user-avatar">
            {
                user.avatar
                    ?
                    <img src={user.avatar}
                         alt="User avatar"/>
                    :
                    <i className="material-icons">account_circle</i>
            }

            <div className="pseudo">
                {user.pseudo}
            </div>
        </div>
    </Link>
);

UserAvatarIcon.propTypes = {
    user: React.PropTypes.object.isRequired,
    className: React.PropTypes.string
};

UserAvatarIcon.getDefaultProps = {
    className: null
};

UserAvatarIcon._handleAuthorClick = (authorId, event) => {
    UserStore.onTrackClick(authorId);
    return event;
};

module.exports = UserAvatarIcon;