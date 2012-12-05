//自动加载目录测试
module.exports.conf = require('./config/autoReuqire.conf.js');
var	http = require('http'),
	rrest = require('../'),
	server = http.createServer(function (req, res){
			res.send('rrest.mod is :'+JSON.stringify(rrest.mod));
	}).listen(rrest.config.listenPort);	


