var multer = require('multer');
var aws = require('aws-sdk');
var multerS3 = require('multer-s3');

module.exports = function (server) {

    aws.config.update({
        accessKeyId: server.settings.upload.aws.accessKeyId,
        secretAccessKey: server.settings.upload.aws.secretAccessKey
    });

    var s3 = new aws.S3();

    var storage = multerS3({
        s3: s3,
        bucket: server.settings.upload.aws.bucket,
        acl: server.settings.upload.aws.acl || 'public-read',
        key: function (req, file, cb) {
            var key = server.upload.getFileHash(file.fieldname, file.originalname);
            cb(null, key);
        }
    });

    server.upload = {};

    var uploadDocument = multer({
        storage: storage,
        limits: { fileSize: 5000000 }
    });

    var uploadAvatar = multer({
        storage: storage,
        limits: { fileSize: 1000000 }
    });

    server.upload.document = function (req, res) {

        return uploadDocument.single(server.constants.DOCUMENT)(req, res, function (err) {
            if (err) {
                return server.sendError(res, 500, 'Unexpected error in the document upload process', err.toString());
            }

            res.send({
                url: req.file.location,
                name: req.file.originalname
            });
        })
    };

    server.upload.avatar = function (req, res) {

        return uploadAvatar.single(server.constants.AVATAR)(req, res, function (err) {
            if (err) {
                return server.sendError(res, 500, 'Unexpected error in the document upload process', err.toString());
            }

            res.send({
                url: req.file.location,
                name: req.file.originalname
            });
        })
    };

}