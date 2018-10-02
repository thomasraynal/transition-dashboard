module.exports = function(server) {

    var Intervention = server.models.Intervention;

    return function(req, res, next) {

        var intervention = req.body;
        intervention.owner = req.auth.user._id;
        intervention.dashboard = req.auth.user.dashboard;

        Intervention(req.body)
            .save()
            .then(instance => {

                return Intervention
                    .findById(instance.id)
                    .populate('owner', '_id firstName lastName position avatar')
                    .then(instance => {
                        res.send(instance);
                    })
            })
            .catch(err => {
                return server.sendError(res, 500, 'Unexpected error in the Intervention creation process', err);
            });

    }
}