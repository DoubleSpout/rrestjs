module.exports.conf = require('./config/autorouter.conf.js');
var http = require('http'),
	rrest = require('../'),
	server = http.createServer(function (req, res){
			res.name = 'customer';
	}).listen(rrest.config.listenPort);	


