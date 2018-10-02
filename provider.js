module.exports = function (server) {
    return {
        registerPlugin: function (pluginType) {
            const plugin = server.settings.plugins[pluginType];
            require(`./plugins/${pluginType}/${plugin}`)(server);
        }
    };
};