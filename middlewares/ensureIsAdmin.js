module.exports = function(server) {
    return function(req, res, next) {

        var signed = req.auth.user;

        if (req.auth.user.identity !=  'ADMIN') return server.sendError(res, 401, 'Invalid credentials', 'User identity must be ADMIN');
   
        next();
    }
}
