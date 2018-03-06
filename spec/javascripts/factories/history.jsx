'use strict';

import faker from 'faker';

module.exports = (props = {}) => ({
    changedAt: props.defined ? '2017-05-05' : faker.date.past().toDateString(),
    changeset: {
        name: 'previous name'
    },

    article: {belongsTo: 'articles'}
});
