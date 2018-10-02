var mongoose = require('mongoose');

module.exports = function(server) {
    return function(req, res, next) {
        var Document = server.models.Document;
        var query = Document.find({ position: req.params.position, dashboard: new mongoose.Types.ObjectId(req.auth.user.dashboard) });

        query.exec(function(err, instances) {
            if (err) {
                return server.sendError(res, 500, 'Unexpected error in the Document list by position process', err);
            }

            res.send(instances)
        })
    }
}