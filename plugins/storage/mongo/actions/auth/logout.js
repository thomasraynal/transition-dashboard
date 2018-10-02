module.exports = function(server) {
    var AuthToken = server.models.AuthToken;

    return function(req, res, next) {
        AuthToken.findByIdAndRemove(req.auth.token, function(err, data) {
            if (err) {
                return server.sendError(res, 500, 'Unexpected error in the login out process', err);
            }
            res.send();
        });
    };
};