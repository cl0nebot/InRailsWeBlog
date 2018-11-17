'use strict';

import faker from 'faker';

module.exports = (props = {}) => ({
    pseudo: props.defined ? 'user pseudo' : faker.name.title(),
    email: props.defined ? 'user@email.com' : faker.internet.email(),
    firstName: props.defined ? 'user first name' : faker.internet.userName(),
    lastName: props.defined ? 'user last name' : faker.internet.userName(),
    city: props.defined ? 'user city' : faker.address.city(),
    country: props.defined ? 'user country' : faker.address.country(),
    additionalInfo: props.defined ? 'user info' : faker.lorem.words(10),
    locale: 'fr',
    signInCount: props.defined ? 5 : Math.random() * 10 | 0,
    lastSignInAt: props.defined ? '05-05-2017' : faker.date.past().toDateString(),
    articlesCount: props.defined ? 5 : Math.random() * 10 | 0,
    avatarUrl: props.defined ? '/assets/users/avatar.png' : faker.image.imageUrl(),
    slug: `/users/${props.id}`,

    settings: {belongsTo: 'settings'}
});
