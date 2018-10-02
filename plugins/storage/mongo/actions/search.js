var Promise = require("bluebird");
var _ = require('lodash');

module.exports = function (server) {

    var Intervention = server.models.Intervention;
    var Participant = server.models.Participant;
    var Document = server.models.Document;

    return function (req, res, next) {

        var searchFor = req.query.term.toLowerCase();

        var participantType = "PARTICIPANT";
        var interventionType = "INTERVENTION";
        var documentType = "DOCUMENT";

        var interventions = Intervention
            .find({}, '_id date owner')
            .populate('owner')
            .sort('date')
            .then(interventions => {

                return _
                    .chain(interventions)
                    .filter((intervention) => {
                        return _.includes(intervention.owner.firstName.toLowerCase(), searchFor) ||
                            _.includes(intervention.owner.lastName.toLowerCase(), searchFor) ||
                            _.includes(intervention.owner.position.toLowerCase(), searchFor);
                    })
                    .transform((aggregate, intervention) => {
                        aggregate.push({
                            _id: intervention.id,
                            date: intervention.date,
                            firstName: intervention.owner.firstName,
                            lastName: intervention.owner.lastName,
                            position: intervention.owner.position,
                            avatar: intervention.owner.avatar,
                            type: interventionType
                        })
                    })
                    .value();

            });

        var participants = Participant
            .find()
            .or({ "firstName": { "$regex": searchFor, "$options": "i" } })
            .or({ "lastName": { "$regex": searchFor, "$options": "i" } })
            .or({ "position": { "$regex": searchFor, "$options": "i" } })
            .then(participants => {

                return _.transform(participants, (aggregate, participant) => {
                    aggregate.push({
                        _id: participant.id,
                        firstName: participant.firstName,
                        lastName: participant.lastName,
                        position: participant.position,
                        avatar: participant.avatar,
                        type: participantType
                    })
                });


            });


        var documents = Document
            .find({}, '_id date name owner position')
            .populate('owner')
            .sort('date')
            .then(documents => {

                return _
                    .chain(documents)
                    .filter((document) => {
                        return _.includes(document.owner.firstName.toLowerCase(), searchFor) ||
                            _.includes(document.owner.lastName.toLowerCase(), searchFor) ||
                            _.includes(document.owner.position.toLowerCase(), searchFor) ||
                            _.includes(document.name.toLowerCase(), searchFor) ||
                            _.includes(document.position.toLowerCase(), searchFor);
                    })
                    .transform((aggregate, document) => {
                        aggregate.push({
                            _id: document.id,
                            date: document.date,
                            name: document.name,
                            firstName: document.owner.firstName,
                            lastName: document.owner.lastName,
                            position: document.position,
                            avatar: document.owner.avatar,
                            type: documentType
                        })
                    })
                    .value();

            });


        Promise.all([interventions, participants, documents])
            .then((results) => {
                res.send(_.flatten(results));
            })
            .catch(err => {
                return server.sendError(res, 500, 'Unexpected error in the Search list process', err);
            });

    };

};