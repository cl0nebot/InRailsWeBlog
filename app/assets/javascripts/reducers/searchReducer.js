'use strict';

import {
    Record,
    Map,
    List,
    fromJS
} from 'immutable';

import * as ActionTypes from '../constants/actionTypes';

import * as Records from '../constants/records';

import {
    toList,
    fetchReducer,
    mutateArray
} from './mutators';

// Autocomplete
const AutocompleteRecord = new Record({
    // Required for fetchReducer/mutationReducer
    isFetching: false,
    pagination: new Map(),
    errors: new Map(),

    query: undefined,

    topics: new List(),
    tags: new List(),
    articles: new List()
});

export function autocompleteReducer(state = new AutocompleteRecord(), action) {
    switch (action.type) {
        case ActionTypes.SEARCH_AUTOCOMPLETE_FETCH_INIT:
        case ActionTypes.SEARCH_AUTOCOMPLETE_FETCH_SUCCESS:
        case ActionTypes.SEARCH_AUTOCOMPLETE_FETCH_ERROR:
            return fetchReducer(state, action, (payload) => ({
                topics: toList(payload.topics, Records.TopicRecord),
                tags: toList(payload.tags, Records.TagRecord),
                articles: toList(payload.articles, Records.ArticleRecord)
            }));

        default:
            return state;
    }
}

// Search
const SearchRecord = new Record({
    isSearching: false,
    hasResults: false,
    hasSearched: false,

    searchParams: new Map(),
    isShowingFilters: false,
    topicFilters: new Map(),
    topicActiveFilters: new Map(),
    tagFilters: new Map(),
    tagActiveFilters: new Map(),
    articleFilters: new Map(),
    articleActiveFilters: new Map(),

    query: undefined,

    topics: new List(),
    tags: new List(),
    articles: new List(),

    topicSuggestions: new List(),
    tagSuggestions: new List(),
    articleSuggestions: new List(),

    selectedItemType: undefined,
    selectedItemId: undefined,
    cancelSelection: false,
    selectedFromMap: false,

    totalArticlePages: undefined,
    totalTopics: undefined,
    totalTags: undefined,
    totalArticles: undefined,
    currentPage: 1,

    relatedTopics: new List(),
    relatedTags: new List(),
    relatedArticles: new List(),

    metaResults: new Map()
});

const _parseSearchResults = (searchState, action) => {
    let newState = {};

    newState.isSearching = action.isSearching;
    newState.isOverview = !!action.isOverview;
    newState.hasSearched = true;

    newState.query = action.query;

    newState.searchParams = fromJS(action.searchParams);

    newState.topics = toList(action.topics, Records.TopicRecord);
    newState.tags = toList(action.tags, Records.TagRecord);
    newState.articles = toList(action.articles, Records.ArticleRecord);

    newState.hasResults = !(newState.topics.isEmpty() && newState.tags.isEmpty() && newState.articles.isEmpty());

    newState.totalTopics = action.totalCount.topics;
    newState.totalTags = action.totalCount.tags;
    newState.totalArticles = action.totalCount.articles;
    newState.totalArticlePages = action.totalPages.articles;

    newState.currentPage = parseInt(action.page || action.searchParams.page || 1, 10);

    if (action.suggestions) {
        newState.topicSuggestions = new List(action.suggestions.topics);
        newState.tagSuggestions = new List(action.suggestions.tags);
        newState.articleSuggestions = new List(action.suggestions.articles);
    }

    if (action.aggregations) {
        newState.topicFilters = new Map(action.aggregations.topics);
        newState.tagFilters = new Map(action.aggregations.tags);
        newState.articleFilters = new Map(action.aggregations.articles);
    }

    newState.topicActiveFilters = searchState.topicActiveFilters.concat(action.topicFilters);
    newState.tagActiveFilters = searchState.tagActiveFilters.concat(action.tagFilters);
    newState.articleActiveFilters = searchState.articleActiveFilters.concat(action.articleFilters);

    return searchState.merge(newState);
};

export function searchReducer(state = new SearchRecord(), action) {
    switch (action.type) {
        case ActionTypes.SEARCH_FETCH_INIT:
            return state.set('isSearching', action.isSearching);
        case ActionTypes.SEARCH_FETCH_ERROR:
            return state.merge({
                isSearching: false,
                hasResults: false
            });
        case ActionTypes.SEARCH_FETCH_SUCCESS:
            return _parseSearchResults(state, action);

        case ActionTypes.SEARCH_META_SUCCESS:
            return state.merge({
                isSearching: action.isSearching,
                query: action.query,
                metaResults: fromJS(action.metaResults)
            });

        // TOPIC
        case ActionTypes.TOPIC_CHANGE_SUCCESS:
            return state.merge({
                topics: mutateArray(state.topics, new Records.TopicRecord(action.topic), action.removedId)
            });

        // TAG
        case ActionTypes.TAG_CHANGE_SUCCESS:
            return state.merge({
                tags: mutateArray(state.tags, new Records.TagRecord(action.tag), action.removedId)
            });

        // ARTICLE
        case ActionTypes.ARTICLE_CHANGE_SUCCESS:
            return state.merge({
                articles: mutateArray(state.articles, new Records.ArticleRecord(action.article), action.removedId)
            });

        default:
            return state;
    }
}