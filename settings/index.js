module.exports = function(server) {

    server.settings = require('./settings.json');
    server.constants = require('./constants.js');

    require('./errorHandler')(server);
    require('./logger')(server);
}