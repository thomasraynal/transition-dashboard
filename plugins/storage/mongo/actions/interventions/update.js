module.exports = function(server) {
    return function(req, res, next) {
        var Intervention = server.models.Intervention;

        var update = Intervention.findByIdAndUpdate(req.params.id, {
            content: req.body.content,
            date: req.body.date
        }, { new: true });

        var select = Intervention
            .findById(req.params.id)
            .populate('owner', '_id firstName lastName position avatar');

        select.exec(function(err, instance) {
            if (err) {
                return server.sendError(res, 500, 'Unexpected error in the Intervention update process', err);
            }

            //ensure is owner...
            if (req.auth.user._id.toString() != instance.owner._id) {
                return server.sendError(res, 500, 'User does not own the ressource', 'User must be the ressource owner is order to update it');
            }

            update.exec(function(err, oldInstance) {
                if (err) {
                    return server.sendError(res, 500, 'Unexpected error in the Intervention update process', err);
                }

                select.exec(function(err, instance) {
                    if (err) {
                        return server.sendError(res, 500, 'Unexpected error in the Intervention update process', err);
                    }
                    res.send(instance);
                });
            });

        });
    };
};