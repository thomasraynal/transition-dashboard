var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

module.exports = function(server) {
    server.models = server.models || {};
    server.models.mongoose = mongoose;

    server.models.mongoose.connection = mongoose.connect(server.settings.storage.mongo.db, { useMongoClient: true });

    server.models.Participant = require('./Participant')(server);
    server.models.Dashboard = require('./Dashboard')(server);
    server.models.Intervention = require('./Intervention')(server);
    server.models.Document = require('./Document')(server);
    server.models.AuthToken = require('./AuthToken')(server);
}