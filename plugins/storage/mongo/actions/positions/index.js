module.exports = function(server) {
    return {
        list: require('./list')(server),
        interventions: require('./interventions')(server),
        participants: require('./participants')(server),
        documents: require('./documents')(server),
    }
}
