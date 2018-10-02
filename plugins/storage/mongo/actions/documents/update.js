module.exports = function(server) {
    return function(req, res, next) {
        var Document = server.models.Document;

        var update = Document.findByIdAndUpdate(req.params.id, {
            url: req.body.url,
            name: req.body.name,
            position: req.body.position,
            date: req.body.date,
            type: req.body.type,
            owner: req.body.owner
        }, { new: true });

        var select = Document
            .findById(req.params.id)
            .populate('owner', '_id firstName lastName position avatar');

        select.exec(function(err, instance) {
            if (err) {
                return server.sendError(res, 500, 'Unexpected error in the Document update process', err);
            }

            //ensure is owner...
            if (req.auth.user._id.toString() != instance.owner._id) {
                return server.sendError(res, 500, 'User does not own the ressource', 'User must be the ressource owner is order to update it');
            }

            update.exec(function(err, oldInstance) {
                if (err) {
                    return server.sendError(res, 500, 'Unexpected error in the Document update process', err);
                }

                select.exec(function(err, instance) {
                    if (err) {
                        return server.sendError(res, 500, 'Unexpected error in the Document update process', err);
                    }
                    res.send(instance);
                });
            });

        });
    };
};