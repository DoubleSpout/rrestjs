module.exports.rrestjsconfig = require('./config/post.conf.js');
var http = require('http'),
	rrest = require('../'),
    server = http.createServer(function (req, res) {
			res.send(htmlstr);
	}).listen(rrest.config.listenPort);
	rrest.clientpipe(server);




var fs = require('fs');
var htmlstr = fs.readFileSync(__dirname+'/static/pipe.html', 'utf-8')