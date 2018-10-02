var router = require('express').Router();
module.exports = function(server) {
    router
        .get('/',
            server.middlewares.ensureAuthenticated,
            server.actions.positions.list)
        .get('/:position/interventions',
            server.middlewares.ensureAuthenticated,
            server.actions.positions.interventions)
        .get('/:position/participants',
            server.middlewares.ensureAuthenticated,
            server.actions.positions.participants)
        .get('/:position/documents',
            server.middlewares.ensureAuthenticated,
            server.actions.positions.documents)
    return router;
};