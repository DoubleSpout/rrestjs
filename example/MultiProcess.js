module.exports.appconfig = require('./config/multi.conf.js');
var http = require('http'),
	rrest = require('../'),
	server = http.createServer(rrest(function (req, res){
			res.send('process '+rrest.id+' is listen at '+rrest.config.listenPort[rrest.id]+' : hello world everyone!');
	}));
	rrest.listen(server);//这里如果不传port参数，则回去读config文件里的端口号
