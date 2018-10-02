module.exports = function(fields, server) {
    return function(req, res, next) {
        var requiredFields = (fields instanceof Array) ? fields : [fields];
        var missingFields = [];

        requiredFields.forEach(function(field) {

            if (!req.body[field]) {
                missingFields.push(field);
            }
        });

        if (missingFields.length > 0) return server.sendError(res, 400, 'Missing field(s)', missingFields);

        next();
    }
}