var router = require('express').Router();
module.exports = function (server) {
    router
        .put('/',
            server.middlewares.ensureAuthenticated,
            server.middlewares.bodyparser,
            server.middlewares.ensureBodyFields(['email', 'firstName', 'lastName', 'position', 'password'], server),
            server.middlewares.ensureIsAdmin,
            server.actions.participants.create)
        .get('/',
            server.middlewares.ensureAuthenticated,
            server.actions.participants.list)
        .patch('/:id',
            server.middlewares.ensureAuthenticated,
            server.middlewares.bodyparser,
            server.middlewares.ensureBodyFields(['email', 'firstName', 'lastName', 'position'], server),
            server.middlewares.ensureIsAdmin,
            server.actions.participants.update)
        .delete('/:id',
            server.middlewares.ensureAuthenticated,
            server.middlewares.ensureIsAdmin,
            server.actions.participants.remove)

    return router;
};