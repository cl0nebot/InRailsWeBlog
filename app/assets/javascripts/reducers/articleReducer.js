'use strict';

import {
    Record,
    Map,
    List
} from 'immutable';

import * as ActionTypes from '../constants/actionTypes';

import * as Records from '../constants/records';

import {
    toList,
    fetchReducer,
    mutationReducer, mutateArray
} from './mutators';

const initState = new Record({
    isFetching: false,
    isProcessing: false,
    errors: new Map(),

    articles: new List(),
    pagination: new Map(),

    article: undefined,
    articleEditionId: undefined,
});

export default function articleReducer(state = new initState(), action) {
    switch (action.type) {
        case ActionTypes.ARTICLE_FETCH_INIT:
        case ActionTypes.ARTICLE_FETCH_SUCCESS:
        case ActionTypes.ARTICLE_FETCH_ERROR:
            return fetchReducer(state, action, (payload) =>
                payload.article ? ({
                    article: new Records.ArticleRecord(payload.article)
                }) : ({
                    articles: toList(payload.articles, Records.ArticleRecord)
                })
            );

        case ActionTypes.ARTICLE_EDITION:
            return state.merge({
                articleEditionId: action.articleId
            });

        case ActionTypes.ARTICLE_CHANGE_INIT:
        case ActionTypes.ARTICLE_CHANGE_SUCCESS:
        case ActionTypes.ARTICLE_CHANGE_ERROR:
            return mutationReducer(state, action, (payload) =>
                payload.articles ? ({
                    articles: toList(payload.articles, Records.ArticleRecord)
                }) : ({
                    articles: mutateArray(state.articles, payload.article && new Records.ArticleRecord(payload.article), action.removedId)
                }), ['article']);

        // load article history
        // articleVersions: dataReceived['paper_trail/versions'] || []

        // retrieve history
        // articleRestored: dataReceived.article


        default:
            return state;
    }
};
