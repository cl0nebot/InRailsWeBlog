'use strict';

import {scaleDown as BurgerMenu} from 'react-burger-menu';

const AdminMenu = ({}) => (
    <BurgerMenu
        pageWrapId="page-wrap"
        outerContainerId="outer-container">
        <a
            className="menu-item"
            href="/admin">
            <i className="material-icons">dashboard</i>
            {I18n.t('js.admin.menu.dashboard')}
        </a>
        <a className="menu-item"
           href="/admin/users_manager">
            <i className="material-icons">account_circle</i>
            {I18n.t('js.admin.menu.users')}
        </a>
        <a className="menu-item"
           href="/admin/errors">
            <i className="material-icons">error</i>
            {I18n.t('js.admin.menu.errors')}
        </a>
        <a className="menu-item"
           href="/admin/sidekiq">
            <i className="material-icons">subscriptions</i>
            {I18n.t('js.admin.menu.sidekiq')}
        </a>
        <a className="menu-item"
           href="/">
            <i className="material-icons">arrow_back</i>
            {I18n.t('js.admin.menu.back_home')}
        </a>
    </BurgerMenu>
);

export default AdminMenu;
