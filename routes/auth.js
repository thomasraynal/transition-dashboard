var router = require('express').Router();
module.exports = function (server) {
    router
        .post('/register',
            server.middlewares.bodyparser,
            server.middlewares.ensureBodyFields([
                'firstName',
                'lastName',
                'email',
                'password',
                'dashboard'
            ], server),
            server.actions.auth.register)
        .post('/login',
            server.middlewares.bodyparser,
            server.middlewares.ensureBodyFields(['email', 'password'], server),
            server.actions.auth.login)
        .post('/logout',
            server.middlewares.ensureAuthenticated,
            server.actions.auth.logout)




    return router;
};
