'use strict';

import * as ActionTypes from '../constants/actionTypes';

// Users
export const showUserSignup = () => ({
    type: ActionTypes.UI_SWITCH_USER_SIGNUP
});

export const showUserLogin = () => ({
    type: ActionTypes.UI_SWITCH_USER_LOGIN
});

export const showUserPreference = () => ({
    type: ActionTypes.UI_SWITCH_USER_PREFERENCE
});

// Topics
export const showTopicPopup = () => ({
    type: ActionTypes.UI_SWITCH_TOPIC_HEADER
});

// Articles
export const updateArticleOrderDisplay = (order) => ({
    type: ActionTypes.UI_CHANGE_ARTICLE_ORDER,
    order
});

export const switchArticleMinimized = (order) => ({
    type: ActionTypes.UI_SWITCH_ARTICLE_MINIMIZED,
    order
});

export const setCurrentArticles = (action, articleId) => ({
    type: ActionTypes.UI_CHANGE_CURRENT_ARTICLES,
    action,
    articleId
});

// Tags
export const switchTagSidebar = (isOpen) => ({
    type: ActionTypes.UI_SWITCH_TAG_SIDEBAR,
    isOpen
});

// export const updateTagOrderDisplay = (order) => ({
//     type: ActionTypes.UI_CHANGE_TAG_ORDER,
//     order
// });
