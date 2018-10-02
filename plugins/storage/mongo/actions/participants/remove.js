module.exports = function(server) {
    return function(req, res, next) {
        var Participant = server.models.Participant;
        var query = Participant.findByIdAndRemove(req.params.id);

        query.exec(function(err, removedInstance) {
            if (err) {
                return server.sendError(res, 500, 'Unexpected error in the Participant remove process', err);
            }
            res.send(removedInstance);
        });
    }
}