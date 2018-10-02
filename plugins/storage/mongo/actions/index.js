module.exports = function(server) {
    server.actions = server.actions || {};
    server.actions.positions = require('./positions')(server);
    server.actions.interventions = require('./interventions')(server);
    server.actions.participants = require('./participants')(server);
    server.actions.documents = require('./documents')(server);
    server.actions.dashboards = require('./dashboard')(server);
    server.actions.auth = require('./auth')(server);
    server.actions.search = require('./search')(server);
}
