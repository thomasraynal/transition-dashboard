module.exports = function(server) {
    return function(req, res, next) {
        var Dashboard = server.models.Dashboard;
        
        var query = Dashboard
            .findByIdAndRemove(req.params.id)
            .populate('owner', '_id firstName lastName position avatar');
            
        var select = Dashboard.findById(req.params.id);

        select.exec(function(err, instance) {
            if (err) {
                return server.sendError(res, 500, 'Unexpected error in the Dashboard delete process', err);
            }

            //ensure is owner...
            if (req.auth.user._id.toString() != instance.owner) {
                return server.sendError(res, 500, 'User doest not own the ressource', 'User must be the ressource owner is order to delete it');
            }

            query.exec(function(err, removedInstance) {
                if (err) {
                    return server.sendError(res, 500, 'Unexpected error in the Dashboard remove process', err);
                }
                res.send(removedInstance);
            });

        });
    };
};