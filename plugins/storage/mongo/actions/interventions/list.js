var mongoose = require('mongoose');

module.exports = function (server) {
    return function (req, res, next) {

        var Intervention = server.models.Intervention;
    
        Intervention
            .find({ dashboard: new mongoose.Types.ObjectId(req.auth.user.dashboard) })
            .populate('owner', '_id firstName lastName position avatar')
            .then(instances => {
                res.send(instances);
            })
            .catch(err => {
                return server.sendError(res, 500, 'Unexpected error in the Intervention list process', err);
            });

    }
}