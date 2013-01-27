module.exports.appconfig = require('./config/multi.conf.js');
var http = require('http'),
	rrest = require('../'),
	server = http.createServer(function (req, res){
            
			res.send('process '+rrest.child.id+' is listen at '+rrest.config.listenPort[rrest.id]+' : hello world everyone!');
	}).listen(rrest.config.listenPort);//多进程监听无需改变代码
