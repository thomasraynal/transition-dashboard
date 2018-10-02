var router = require('express').Router();

module.exports = function(server) {

    router
        .get('/',
            //server.middlewares.ensureAuthenticated,
            server.actions.search);

    return router;
};