var mongoose = require('mongoose');

module.exports = function (server) {
    return function (req, res, next) {
        var Participant = server.models.Participant;
        var query = Participant
            .find({ dashboard: new mongoose.Types.ObjectId(req.auth.user.dashboard) })
            .distinct('position');

        query.exec(function (err, instances) {
            if (err) {
                return server.sendError(res, 500, 'Unexpected error in the Participant list process', err);
            }

            res.send(instances);
        });
    };
};