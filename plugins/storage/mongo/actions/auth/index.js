module.exports = function(server) {
    return {
        login: require('./login')(server),
        register: require('./register')(server),
        logout: require('./logout')(server)
    }
}
