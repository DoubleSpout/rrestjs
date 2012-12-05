module.exports.rrestjsconfig = require('./config/post.conf.js');
var http = require('http'),
	rrest = require('../'),
    server = http.createServer(function (req, res) {
		res.cache('public', 1000);
		res.clearcookie('rrSid');
		res.cookie('RestSpout', 'I am coming!');

		//res.redirect('http://www.baidu.com')

		//res.send('<body>API</body>');
		res.sendjson({name:'spout', age:27},200, false, false);		  
		console.log('has request!')
	}).listen(rrest.config.listenPort);