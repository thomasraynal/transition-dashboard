var jwt = require('jsonwebtoken');

module.exports = function(server) {
    var AuthToken = server.models.AuthToken;
    var Participant = server.models.Participant;

    return function(req, res, next) {
        var signed = req.headers['authorization']

        if (!signed) return server.sendError(res, 401, 'Empty authorization header', 'User must be logged in');

        jwt.verify(signed, server.settings.secret, function(err, decoded) {
            if (err) return server.sendError(res, 401, 'Invalid token', 'token ' + signed + ' is invalid');

            var tokenId = decoded.auth;
            AuthToken.findById(tokenId, function(err, token) {

                if (err) return server.sendError(res, 500, 'Unexpected error during the authentification process', err);
                if (!token) return server.sendError(res, 401, 'User is not authorized', 'The provided token is expired');

                Participant.findById(token.userId, function(err, user) {
                    if (err) return server.sendError(res, 500, 'Unexpected error during the user data retrieval', err);

                    req.auth = req.auth || {};
                    req.auth.user = user;
                    req.auth.token = token._id;

                    next();
                })
            })
        });
    }
}