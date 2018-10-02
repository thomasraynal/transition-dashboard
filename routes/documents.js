var router = require('express').Router();
module.exports = function(server) {
    router
        .put('/',
            server.middlewares.ensureAuthenticated,
            server.middlewares.bodyparser,
            server.middlewares.ensureBodyFields(['owner', 'position', 'type', 'name', 'url'], server),
            server.actions.documents.create)
        .get('/',
            server.middlewares.ensureAuthenticated,
            server.actions.documents.list)
        .patch('/:id',
            server.middlewares.ensureAuthenticated,
            server.middlewares.bodyparser,
            server.middlewares.ensureBodyFields(['owner', 'position', 'type', 'name', 'url'], server),
            server.actions.documents.update)
        .delete('/:id',
            server.middlewares.ensureAuthenticated,
            server.actions.documents.remove);

    return router;
};