var conf = module.exports.rrestjsconfig = require('./config/post.conf.js');
var conf_dev = module.exports.rrestjsconfig_dev = require('./config/post.conf_dev.js');
conf.manualRouter = {//手动路由
	"get:/user/face":function(req, res){res.send('change face')},
	"post:put:/user/info":function(req, res){res.send('get not access!')},
	"/user/all":function(req, res){
		if(!req.session.count) req.session.count = 0
		res.send('all can access!'+(req.session.count++));
			},
}
var http = require('http'),
	rrest = require('../'),
    server = http.createServer(function (req, res){
		if(req.pathname === '/'){
			res.send('hello world' + 'dev config isClientPipe:'+rrest.config.isClientPipe+'  isSession:'+rrest.config.isSession) 
			return false;
		}
	}).listen(rrest.config.listenPort);