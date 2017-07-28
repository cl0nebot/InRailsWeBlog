'use strict';

// require('../admin');

let UserShow = require('../../../components/users/show');

const userId = JSON.parse(document.getElementById('user-admin-component').getAttribute('data-user-id'));

// Main
if ($app.isUserConnected()) {
    ReactDOM.render(
        <UserShow userId={userId}/>,
        document.getElementById('user-admin-component')
    );
}

