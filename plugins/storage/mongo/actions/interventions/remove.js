module.exports = function(server) {
    return function(req, res, next) {
        var Intervention = server.models.Intervention;

        var query = Intervention
            .findByIdAndRemove(req.params.id)
            .populate('owner', '_id firstName lastName position avatar');
            
        var select = Intervention.findById(req.params.id);

        select.exec(function(err, instance) {
            if (err) {
                return server.sendError(res, 500, 'Unexpected error in the Intervention delete process', err);
            }

            //ensure is owner...
            if (req.auth.user._id.toString() != instance.owner) {
                return server.sendError(res, 500, 'User does not own the ressource', 'User must be the ressource owner is order to delete it');
            }

            query.exec(function(err, removedInstance) {
                if (err) {
                    return server.sendError(res, 500, 'Unexpected error in the Intervention remove process', err);
                }
                res.send(removedInstance);
            });

        });
    };
};