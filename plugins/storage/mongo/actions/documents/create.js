var mongoose = require('mongoose');

module.exports = function (server) {

    var Document = server.models.Document;

    return function (req, res, next) {

        var doc = req.body;
        doc.owner = req.auth.user._id;
        doc.dashboard = req.auth.user.dashboard;

        return Document
            .find({ url: doc.url, dashboard: new mongoose.Types.ObjectId(doc.dashboard) })
            .then(instance => {
                if (instance.length > 0) {
                    return server.sendError(res, 403, 'Document already exists', `The document url ${doc.url} of dashboard ${doc.dashboard} is already set in document ${instance[0].name}`);
                } else {
                    return Document(doc)
                        .save()
                        .then(instance => {

                            return Document
                                .findById(instance.id)
                                .populate('owner', '_id firstName lastName position avatar')
                                .then(instance => {
                                    res.send(instance);
                                })
                        });
                }

            })
            .catch(err => {
                return server.sendError(res, 500, 'Unexpected error in the Document show process', err);
            });

    }
}