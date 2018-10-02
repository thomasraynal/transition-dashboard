var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');

module.exports = function (server) {

    var Dashboard = server.models.Dashboard;
    var Participant = server.models.Participant;
    var AuthToken = server.models.AuthToken;

    return function (req, res, next) {

        let _dashboard = null;
        let _admin = null;

        function createDashboard() {

            var dashboard = new Dashboard({
                name: req.body.dashboard,
                owner: new mongoose.Types.ObjectId()
            });

            return dashboard.save();
        };

        function doesAdminExist(admin) {
            return Participant.findOne({
                mail: admin.email,
                position: server.constants.ADMIN
            })

        };
        
        function createAdmin(dashboard, err) {

            if (err) {
                return server.sendError(res, 500, 'Unexpected error in the Register process', err);
            }

            _dashboard = dashboard;

            var admin = new Participant({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password
            });

            admin.password = bcrypt.hashSync(admin.password, 10);
            admin.identity = admin.position = server.constants.ADMIN;
            admin.dashboard = dashboard._id;

            return doesAdminExist(admin)
                .then(instance => {

                    if (instance) {
                        return server.sendError(res, 400, `User with email ${admin.email} already exist`, "Please use another email to create account");
                    }

                    return admin.save();
                });
        };

        function updateDashboard(admin, err) {

            if (err) {
                return server.sendError(res, 500, 'Unexpected error in the Register process', err);
            }

            _admin = admin;

            return Dashboard
                .findByIdAndUpdate(_dashboard._id, {
                    owner: admin._id,
                });

        };

        function login() {

            return new AuthToken({ userId: _admin._id })
                .save(function (err, token) {
                    if (err) {
                        return server.sendError(res, 500, 'Unexpected error in the Register process', err);
                    }

                    var encrypted = jwt.sign({ auth: token._id }, server.settings.secret, { expireIn: token.expire });

                    var epoch = new Date();

                    var result = {
                        user: _admin.toJSON(),
                        expiration: new Date(epoch.setSeconds(epoch.getSeconds() + token.expire)),
                        token: encrypted
                    };

                    res.send(result);
                });

        };

        createDashboard()
            .then(createAdmin)
            .then(updateDashboard)
            .then(login)
            .catch(err => {
                return server.sendError(res, 500, 'Unexpected error in the Register process', err);
            })
    };

}