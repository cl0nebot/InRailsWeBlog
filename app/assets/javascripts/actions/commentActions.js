'use strict';

import * as ActionTypes from '../constants/actionTypes';

import api from '../middlewares/api';

// Comments
export const fetchComments = (commentParams) => {
    let url = `/${I18n.t('js.comment.common.route')}`;
    let requestParam = {};

    if (commentParams) {
        requestParam = commentParams;

        if (commentParams.commentableType && commentParams.commentableId) {
            url = `/${commentParams.commentableType}/${commentParams.commentableId}/${I18n.t('js.comment.common.route')}`;
        } else if (commentParams.commentableId) {
            url = commentParams.commentableId + url;
        } else {
            url = '/comments';
        }

        if (commentParams.page) {
            requestParam.page = commentParams.page;
        } else if (commentParams.isPaginated) {
            requestParam.page = 1;
        }
    }

    return ({
        actionType: ActionTypes.COMMENT,
        fetchAPI: () => api.get(url, requestParam)
    });
};

// Comment mutations
export const addComment = (comment, commentableId, commentableType) => {
    let url = `/${I18n.t('js.comment.common.route')}`;
    if (commentableType && commentableId) {
        url = `/${commentableType}/${commentableId}/comments`;
    } else if (commentableId) {
        url = commentableId + url;
    }

    return ({
        actionType: ActionTypes.COMMENT,
        mutationAPI: () => api.post(url, {
            comment
        })
    });
};

export const updateComment = (comment, commentableId, commentableType) => {
    let url = `/${I18n.t('js.comment.common.route')}`;
    if (commentableType && commentableId) {
        url = `/${commentableType}/${commentableId}/comments`;
    } else if (commentableId) {
        url = commentableId + url;
    }

    return ({
        actionType: ActionTypes.COMMENT,
        mutationAPI: () => api.update(url, {
            comment
        })
    });
};

export const deleteComment = (commentId, commentableId, commentableType) => {
    let url = `/${I18n.t('js.comment.common.route')}`;
    if (commentableType && commentableId) {
        url = `/${commentableType}/${commentableId}/comments`;
    } else if (commentableId) {
        url = commentableId + url;
    }

    return ({
        actionType: ActionTypes.COMMENT,
        mutationAPI: () => api.delete(url, {
            comment: {
                id: commentId
            }
        })
    });
};
