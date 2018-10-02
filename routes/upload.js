var express = require('express')
var router = express.Router();

var path = require('path');

module.exports = function (server) {

    //refacto - should be part of the local upload plugin
    server.use('/uploads', express.static('uploads'));

    //https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(filename) {
        var hash = 5381,
            i = filename.length;

        while (i) {
            hash = (hash * 33) ^ filename.charCodeAt(--i);
        }

        var hash = hash >>> 0;
        var ext = filename.split('.').pop();

        return hash += "." + ext;
    };

    server.upload.getFileHash = function getFileHash(type, name) {
        if (type == server.constants.AVATAR) return hash(`${new Date().getTime()}_${name}`);
        if (type == server.constants.DOCUMENT) return hash(name);
    }

    router
        .post('/' + server.constants.DOCUMENT,
            server.middlewares.ensureAuthenticated,
            server.upload.document)
        .post('/' + server.constants.AVATAR,
            server.middlewares.ensureAuthenticated,
            server.upload.avatar);


    return router;
};