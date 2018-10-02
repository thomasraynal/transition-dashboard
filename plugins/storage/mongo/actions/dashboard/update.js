module.exports = function (server) {
    return function (req, res, next) {

        var Dashboard = server.models.Dashboard;

        var update = Dashboard.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
        });

        var select = Dashboard
            .findById(req.params.id)
            .populate('owner', '_id firstName lastName position avatar');

        select.exec(function (err, instance) {
            if (err) {
                return server.sendError(res, 500, 'Unexpected error in the Dashboard update process', err);
            }

            //ensure is owner...
            if (req.auth.user._id.toString() != instance.owner._id) {
                return server.sendError(res, 500, 'User does not own the dashbaord', 'User must be the dashboard owner is order to update it');
            }

            update.exec(function (err, oldInstance) {
                if (err) {
                    return server.sendError(res, 500, 'Unexpected error in the Dashboard update process', err);
                }

                select.exec(function (err, instance) {
                    if (err) {
                        return server.sendError(res, 500, 'Unexpected error in the Dashboard update process', err);
                    }
                    res.send(instance);
                });
            });

        });
    };
};