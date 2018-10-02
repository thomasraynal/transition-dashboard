module.exports = function(server) {
    return function(req, res, next) {
        var Participant = server.models.Participant;

        var update = Participant.findByIdAndUpdate(req.params.id, {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            avatar: req.body.avatar,
            position: req.body.position,
            phone: req.body.phone,
            identity: req.body.identity
        }, { new: true });

        var select = Participant.findById(req.params.id);

        update.exec(function(err, oldInstance) {
            if (err) {
                return server.sendError(res, 500, 'Unexpected error in the Participant update process', err);
            }

            select.exec(function(err, instance) {
                if (err) {
                    return server.sendError(res, 500, 'Unexpected error in the Participant update process', err);
                }
                res.send(instance);
            });

        })
    }
}