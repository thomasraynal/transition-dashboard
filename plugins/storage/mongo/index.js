module.exports = function (server) {
    require('./models')(server);
    require('./actions')(server);
}
