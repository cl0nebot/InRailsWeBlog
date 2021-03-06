'use strict';

import * as ActionTypes from '../constants/actionTypes';

import api from '../middlewares/api';

// Users
export const fetchUsers = (filter, options = {}) => ({
    actionType: ActionTypes.USER,
    fetchAPI: () => api.get('/api/v1/users', {
        filter,
        ...options
    })
});

export const fetchUser = (userId, options = {}) => ({
    actionType: ActionTypes.USER,
    fetchAPI: () => api.get(`/api/v1/users/${userId}`, {
        ...options
    })
});

export const initUser = (userId, options = {}) => ({
    actionType: ActionTypes.USER,
    fetchAPI: () => api.get(`/api/v1/users/${userId}`, {
        ...options
    }),
    shouldCallAPI: (state) => {
        return !state.userState.user;
    },
    payload: {
        connection: true
    }
});

export const validateUser = (login) => (
    api.get('/api/v1/users/validation', {
        user: {
            login
        }
    }).promise
);

// User mutations
export const signupUser = (user, options = {}) => ({
    actionType: ActionTypes.USER,
    mutationAPI: () => api.post('/api/v1/signup', {
        user,
        ...options
    }),
    payload: {
        connection: true
    }
});

export const loginUser = (user, options = {}) => ({
    actionType: ActionTypes.USER,
    mutationAPI: () => api.post('/api/v1/login', {
        user,
        ...options
    }),
    payload: {
        connection: true
    }
});

export const updateUserSettings = (userId, settings, options = {}) => ({
    actionType: ActionTypes.USER,
    mutationAPI: () => api.post(`/api/v1/users/${userId}/settings`, {
        settings,
        ...options
    }),
    payload: {
        settings: true
    }
});

// User recent events
const receiveUserRecents = (json) => ({
    type: ActionTypes.USER_RECENTS,
    topics: json.topics || [],
    tags: json.tags || [],
    articles: json.articles || []
});
export const fetchUserRecents = (userId, options = {}) => (dispatch) => {
    return api
        .get(`/api/v1/users/${userId}/recents`, options)
        .promise
        .then((json) => dispatch(receiveUserRecents(json)));
};

export const updateUserRecents = (userId, recents, options = {}) => ({
    actionType: ActionTypes.USER_RECENTS,
    mutationAPI: () => api.post(`/api/v1/users/${userId}/recents`, {
        recents,
        ...options
    })
});
