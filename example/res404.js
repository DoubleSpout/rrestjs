
module.exports.rrestjsconfig = require('./config/post.conf.js');
var http = require('http'),
	rrest = require('../'),
	i=0,
    server = http.createServer(function (req, res) {
		var n = (i++)%4;
		if(n === 0) res.r404();
		else if(n === 1) res.r404('/example/static/404.html');
		else if(n === 2)  res.r404(function(){console.log('404cb')});
		else res.r404('/example/static/404.html', function(){console.log('404 page render cb')});		
	}).listen(rrest.config.listenPort);