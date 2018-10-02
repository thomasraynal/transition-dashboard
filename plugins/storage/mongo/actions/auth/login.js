var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var _ = require('lodash');

module.exports = function (server) {
    var AuthToken = server.models.AuthToken;
    var Participant = server.models.Participant;

    return function (req, res, next) {

        var email = req.body.email;
        var dashboard = req.body.dashboard;

        var query = Participant
            .find({ email: email })
            .populate('dashboard')
            .select('+password');

        var password = req.body.password;

        query.exec(function (err, participants) {

            const participant = _.find(participants, (participant) => participant.dashboard.name == dashboard);

            if (err) {
                return server.sendError(res, 500, 'Unexpected error in the login process', err);
            }

            if (!participant) {
                return server.sendError(res, 404, 'Invalid credentials', `User with email ${email} for dashboard ${dashboard} does not exit.`);
            }

            if (!bcrypt.compareSync(password, participant.password)) {
                return server.sendError(res, 401, 'Invalid credentials', `Provided password does not mach user ${email} password for dashboard ${dashboard}.`);
            }

            new AuthToken({ userId: participant._id }).save(function (err, token) {
                if (err) {
                    return server.sendError(res, 500, 'Unexpected error in the login process', err);
                }

                var encrypted = jwt.sign({ auth: token._id }, server.settings.secret, { expireIn: token.expire });

                var epoch = new Date();

                var result = {
                    user: participant.toJSON(),
                    expiration: new Date(epoch.setSeconds(epoch.getSeconds() + token.expire)),
                    token: encrypted
                };

                res.send(result);
            });
        });
    }
}