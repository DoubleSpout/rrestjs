//自动加载目录测试
module.exports.config = require('./config/autoReuqire.conf.js');
var	http = require('http'),
	rrest = require('../'),
	server = http.createServer(function (req, res){
			res.send('use module.exports.config!');
	}).listen(rrest.config.listenPort);	


