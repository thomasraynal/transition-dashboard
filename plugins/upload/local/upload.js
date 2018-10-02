var multer = require('multer');
var path = require('path');

module.exports = function (server) {

    const uploadDirectory = server.settings.upload.local.directory;
    const uploadPath = path.join(server.appRoot, server.settings.upload.local.directory);

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadPath)
        },
        filename: function (req, file, cb) {
            cb(null, server.upload.getFileHash(file.fieldname, file.originalname))
        }
    });

    server.upload = {};

    var uploadDocument = multer({
        storage: storage,
        limits: { fileSize: 5000000 }
    });

    var uploadAvatar = multer({
        storage: storage,
        limits: { fileSize: 500000 }
    });

    server.upload.document = function (req, res) {

        return uploadDocument.single(server.constants.DOCUMENT)(req, res, function (err) {
            if (err) {
                return server.sendError(res, 500, 'Unexpected error in the document upload process', err.toString());
            }

            res.send({
                url: `${server.host}/${uploadDirectory}/${req.file.filename}`,
                name: req.file.filename
            });
        })
    };

    server.upload.avatar = function (req, res) {

        return uploadAvatar.single(server.constants.AVATAR)(req, res, function (err) {
            if (err) {
                return server.sendError(res, 500, 'Unexpected error in the document upload process', err.toString());
            }

            res.send({
                url: `${server.host}/${uploadDirectory}/${req.file.filename}`,
                name: req.file.filename
            });
        })
    };
}