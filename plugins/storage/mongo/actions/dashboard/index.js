module.exports = function(server) {
    return {
        remove: require('./remove')(server),
        update: require('./update')(server),
    }
}