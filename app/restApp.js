module.exports.conf = require('./config/config');
var http = require('http'),
	rrest = require('rrestjs'),
	app = require('./controller/app.js'),
    server = http.createServer(function (req, res){
		app(req, res);
	}).listen(rrest.config.listenPort);

_rrest = rrest; //全局变量
