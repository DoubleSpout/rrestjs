var conf = module.exports.rrestjsconfig = require('./config/post.conf.js');
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
    server = http.createServer(rrest(function (req, res){
		if(req.pathname === '/'){
			res.send('hello world') 
			return false;
		}
	})).listen(rrest.config.listenPort);