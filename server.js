var express = require('express');
var cors = require('cors');
var server = express();
var path = require('path');
var provider = require('./provider')(server);

server.use(cors());
server.appRoot = path.resolve(__dirname);

server.use(express.static(__dirname + '/app/dist/transition-dashboard'));

require('./settings')(server);

provider.registerPlugin('storage');
provider.registerPlugin('upload');

require('./middlewares')(server);
require('./routes')(server);


server.port = process.env.PORT || server.settings.port;
server.host = `${server.settings.scheme}://${server.settings.host}:${server.port}`;

console.log(`Server started [${server.host}]`);

server.listen(server.port);