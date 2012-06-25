 var http = require('http'),
	rrest = require('./index'),
	app = require('./app/app'),
    server = http.createServer(rrest(function (req, res){
		app(req, res);
	})).listen(rrest.config.listenport);

_rrest = rrest; //全局变量
_logger = restlog;
_pool = rrest.mpool;

