module.exports = function(server) {

    function errorHandler(err, req, res, next) {

        return server.sendError(req, 500, 'InternalError', err);
    };

    server.use(errorHandler);

    server.sendError = (res, code, name, msg) => {

        console.log(name + " - " + msg);

        return res.status(code).send({
            "name": name,
            "message": msg.toString()
        });
    };
}