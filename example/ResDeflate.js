module.exports.conf = require('./config/onesession.conf.js');
var http = require('http'),
	rrest = require('../'),
    server = http.createServer(function (req, res) {
		res.send('123456789012345678901234567890', 200);	  
	}).listen(rrest.config.listenPort);