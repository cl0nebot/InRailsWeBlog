'use strict';

import {
    Link
} from 'react-router-dom';

import Dropdown from '../../theme/dropdown';

const HomeUserHeader = ({isUserConnected, isAdminConnected, onLoginClick, onSignupClick, onPreferenceClick, userSlug}) => {
    const adminContent = (
        <React.Fragment>
            <li>
                <a href="/admin">
                    {I18n.t('js.views.header.user.administration')}
                </a>
            </li>

            <li className="dropdown-divider"/>
        </React.Fragment>
    );

    const visitorContent = (
        <React.Fragment>
            <li>
                <a href="/api/v1/signup"
                   onClick={onSignupClick}>
                    {I18n.t('js.views.header.user.sign_up')}
                </a>
            </li>

            <li className="dropdown-divider"/>

            <li>
                <a href="/api/v1/login"
                   onClick={onLoginClick}>
                    {I18n.t('js.views.header.user.log_in')}
                </a>
            </li>
        </React.Fragment>
    );

    const userContent = (
        <React.Fragment>
            <li>
                <a href={`/user/profile/${userSlug}`}>
                    {I18n.t('js.views.header.user.profile')}
                </a>
            </li>

            <li className="dropdown-divider"/>

            <li>
                <a href="#"
                   onClick={onPreferenceClick}>
                    {I18n.t('js.views.header.user.settings')}
                </a>
            </li>

            <li className="dropdown-divider"/>

            <li>
                <a href="/api/v1/logout"
                   data-method="delete"
                   rel="nofollow">
                    {I18n.t('js.views.header.user.log_out')}
                </a>
            </li>
        </React.Fragment>
    );

    return (
        <Dropdown button={<span className="material-icons left"
                                data-icon="account_circle"
                                aria-hidden="true"/>}
                  position="bottom right"
                  buttonClassName="header-button"
                  isFloatingButton={true}
                  isFixed={true}
                  hasArrow={true}>
            <ul>
                {
                    isAdminConnected &&
                    adminContent
                }
                {
                    !isUserConnected &&
                    visitorContent
                }
                {
                    isUserConnected &&
                    userContent
                }
            </ul>
        </Dropdown>
    );
};

HomeUserHeader.propTypes = {
    isUserConnected: PropTypes.bool.isRequired,
    isAdminConnected: PropTypes.bool.isRequired,
    onPreferenceClick: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
    onSignupClick: PropTypes.func.isRequired,
    userSlug: PropTypes.string
};

export default HomeUserHeader;
