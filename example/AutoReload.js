module.exports.conf = require('./config/autoreload.conf.js');
var http = require('http'),
	rrest = require('../'),
	server = http.createServer(rrest(function (req, res){
			res.send('process '+rrest.id+' is listen at '+rrest.config.listenPort+' : hello world everyone!!!');
	})).listen(rrest.config.listenPort);	


