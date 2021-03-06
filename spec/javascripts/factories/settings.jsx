'use strict';

module.exports = (props = {}) => ({
    articlesLoader: 'infinite',
    articleDisplay: 'card',
    articleOrder: undefined,
    tagParentAndChild: false,
    tagSidebarPin: true,
    tagSidebarWithChild: false,
    tagOrder: undefined,
    searchDisplay: 'card',
    searchHighlight: true,
    searchOperator: 'or',
    searchExact: false
});
