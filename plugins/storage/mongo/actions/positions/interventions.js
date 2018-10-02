var mongoose = require('mongoose');

module.exports = function (server) {
    return function (req, res, next) {
        var Intervention = server.models.Intervention;
        var query = Intervention.find({ position: req.params.position, dashboard: new mongoose.Types.ObjectId(req.auth.user.dashboard) });

        query.exec(function (err, instances) {
            if (err) {
                return server.sendError(res, 500, 'Unexpected error in the Intervention list by position process', err);
            }

            res.send(instances)
        })
    }
}