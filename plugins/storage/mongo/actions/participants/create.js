var bcrypt = require('bcrypt');
var mongoose = require('mongoose');

module.exports = function (server) {
    return function (req, res, next) {

        var Participant = server.models.Participant;

        var participant = new Participant(req.body);
        participant.dashboard = req.auth.user.dashboard;

        participant.password = bcrypt.hashSync(participant.password, 10);

        function checkAdminExist() {
            return Participant
                .findOne({
                    email: participant.email,
                    dashboard: new mongoose.Types.ObjectId(participant.dashboard),
                    identity: server.constants.ADMIN
                }).then(instance => {
                    if (instance) return server.sendError(res, 400, `Account with email ${participant.email} already exist`, "Account must have a unique email. PLease choose another email.");;
                });

        };

        function checkUserExist() {

            return Participant
                .findOne({
                    email: participant.email,
                    dashboard: new mongoose.Types.ObjectId(participant.dashboard),
                    identity: server.constants.USER
                })
                .then(instance => {
                    if (instance) return server.sendError(res, 400, `User email ${participant.email} is already in use for dashboard ${req.body.dashboard}`, "Each participant must have a unique email.");;
                });

        };

        function saveParticipant() {
            return participant
                .save()
                .then(instance => {
                    res.send(instance);
                })
        };


        checkAdminExist()
            .then(checkUserExist)
            .then(saveParticipant)
            .catch(err => {
                return server.sendError(res, 500, 'Unexpected error in the Participant create process', err);
            });


    }
}