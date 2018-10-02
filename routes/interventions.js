var router = require('express').Router();
module.exports = function(server) {
    router
        .put('/',
            server.middlewares.ensureAuthenticated,
            server.middlewares.bodyparser,
            server.middlewares.ensureBodyFields(['content', 'date'], server),
            server.actions.interventions.create)
        .get('/',
            server.middlewares.ensureAuthenticated,
            server.actions.interventions.list)
        .patch('/:id',
            server.middlewares.ensureAuthenticated,
            server.middlewares.bodyparser,
            server.middlewares.ensureBodyFields(['content', 'date'], server),
            server.actions.interventions.update)
        .delete('/:id',
            server.middlewares.ensureAuthenticated,
            server.actions.interventions.remove);

    return router;
}