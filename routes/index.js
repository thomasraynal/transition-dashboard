module.exports = function(server) {
    server.use('/interventions', require('./interventions')(server));
    server.use('/participants', require('./participants')(server));
    server.use('/positions', require('./positions')(server));
    server.use('/documents', require('./documents')(server));
    server.use('/auth', require('./auth')(server));
    server.use('/upload', require('./upload')(server));
    server.use('/search', require('./search')(server));
}