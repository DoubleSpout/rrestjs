/*
	基本测试，autorouter 例子
	测试response，tploption，session的_csrf功能
*/
var should = require('should');
var path = require('path');
var testconf = require('./testconf.js');
module.exports.rrestjsconfig = {
	listenPort:3000,
	autoRouter:'/controller',
	baseDir: path.join(__dirname)};
var http = require('http'),
	rrest = require('../'),
    server = http.createServer(function (req, res){
		if(req.path[0]==='user' && req.path[1] === 'info')	return res.send('come on')&&true
	}).listen(rrest.config.listenPort);



var file = require('fs');
var i = 4;
var r = 0
var result = function(name){
	var num = ++r;
	console.log('%s test done, receive %d/%d', name, num, i);
	if(num>=i){
		console.log('autorouter.js test done.')
		process.exit();
	}
}

var getfn = function(path, cb){
	var request  = 	http.request({
			host:testconf.hostname,
			port:3000,
			path:'/'+path,
			method:'GET',
			headers:{'Accept':'text/html',
					 'Content-Type':'application/x-www-form-urlencoded', 
					 'Content-Length':'19',
					 'User-Agent':'node.js-v0.8.8', 
					 'cookie':'userid=123456; mycookie2=abcdefg', 
					 'X-Requested-With':'xmlhttprequest',
					 'Connection':'keep-alive',
					 'Referer':'http://www.cnodejs.org/'}
		}, function(res){
				var body = '';
				res.on('data', function(chunk) {
						// convert chunk to utf8 text:
						 body += chunk;
						// process utf8 text chunk
					});
				res.on('end', function() {
						cb(res, body);
					});
		}).on('err', function(e){
			throw e;
		});
		request.end();
}

getfn('/', function(res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'index/index');
	result('index');
});

getfn('/user', function(res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'user/index');
	result('user/index');
});

getfn('/user/face', function(res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'user/face');
	result('user/face');
});

getfn('/user/info', function(res, body){
	should.strictEqual(res.statusCode, 200);
	should.not.exist(res.headers.user)
	should.strictEqual(body, 'come on');
	result('user/info');
});






