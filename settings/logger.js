var winston = require('winston');
var expressWinston = require('express-winston');
var moment = require('moment');

module.exports = function(server) {

    const format = winston.format.printf((info) => {
        return `${info.level}: ${info.message} (${moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ')})`;
    });

    server.use(expressWinston.logger({
        transports: [
            new winston.transports.Console({ format: winston.format.combine(winston.format.colorize(), format) })
        ],
    }));

}