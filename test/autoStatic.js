/*
	基本测试，response 例子
	jade模版的_csrf, tploption测试，自动静态文件测试（图片，js，css，less），打包js，打包css，打包less
*/
var should = require('should');
var path = require('path');
var request = require('request');
var testconf = require('./testconf.js');
module.exports.rrestjsconfig = {
	listenPort:3000,
	tempSet:'jade',
	isSession:true,
	tempFolder :'/static',
	baseDir: path.join(__dirname),
};


var http = require('http'),
	rrest = require('../'),
    server = http.createServer(function (req, res){
		res.render('/jade.jade', {name:'rrestjs'});
	}).listen(rrest.config.listenPort);

//设置全局的模版option
rrest.tploption.userid = function(req,res){return req.ip};
rrest.tploption.name = 'rrestjs default';
rrest.tploption.usersex = 'male';

http.globalAgent.maxSockets = 10;

var file = require('fs');
var i = 11;
var r = 0
var result = function(name){
	var num = ++r;
	console.log('%s test done, receive %d/%d', name, num, i);
	if(num>=i){
		console.log('autoStatic.js test done.')
		process.exit();
	}
}

var getfn = function(path, cb){
	var request  = 	http.request({
			host:testconf.hostname,
			port:3000,
			path:'/'+path,
			method:'GET',
			headers:{}
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


var acss = file.readFileSync(__dirname+'/static/a.css', 'utf-8');
var bcss = file.readFileSync(__dirname+'/static/b.css', 'utf-8');
var ajs =  file.readFileSync(__dirname+'/static/a.js', 'utf-8');
var bjs =  file.readFileSync(__dirname+'/static/b.js', 'utf-8');
var png =  file.readFileSync(__dirname+'/static/octocat.png', 'utf-8');

getfn('/static/js1/js2/js3/a.js', function(res, body){
	var js = file.readFileSync(__dirname+'/static/a.js', 'utf-8');
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(res.headers['content-type'], 'application/javascript');
	should.strictEqual(body, ajs);
	result('a.js');
});


getfn('/static/b.css', function(res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(res.headers['content-type'], 'text/css; charset=UTF-8');
	should.strictEqual(body, bcss);
	result('b.css');
});


getfn('/static/a.css', function(res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(res.headers['content-type'], 'text/css; charset=UTF-8');
	should.strictEqual(body, acss);
	result('a.css');
});


getfn('/static/b.js', function(res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(res.headers['content-type'], 'application/javascript');
	should.strictEqual(body, bjs);
	result('b.js');
});

getfn('/static/a.less', function(res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(res.headers['content-type'], 'text/css; charset=UTF-8');
	should.strictEqual(body, 'body {\n  color: #4d926f;\n}\n');
	result('a.less');
});


getfn('/static/octocat.png', function(res, body){
	var css = file.readFileSync(__dirname+'/static/octocat.png', 'utf-8');
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(res.headers['content-type'], 'image/png');
	should.strictEqual(body, png);
	result('octocat.png');
});

getfn('/static/?parse=/static/b.js|/static/a.js', function(res, body){

	should.strictEqual(res.statusCode, 200);
	should.strictEqual(res.headers['content-type'], 'application/javascript');
	should.strictEqual(body, 'var b=\"b.js\";var a=\"a.js\";');
	result('a.js|b.js');
});


getfn('/static/?parse=/static/a.css|/static/b.css', function(res, body){

	should.strictEqual(res.statusCode, 200);
	should.strictEqual(res.headers['content-type'], 'text/css; charset=UTF-8');
	should.strictEqual(body, 'body{color:#fff;}body{font-size:12px;}');
	result('a.css|b.css');
});


getfn('/static/?parse=/static/a.less|/static/b.less', function(res, body){

	should.strictEqual(res.statusCode, 200);
	should.strictEqual(res.headers['content-type'], 'text/css; charset=UTF-8');
	should.strictEqual(body, 'body{color:#4d926f;}body{font-size:12px;}');
	result('a.less|b.less');
});


getfn('/', function(res, body){
			should.strictEqual(res.statusCode, 200);
			should.strictEqual(res.headers['content-type'], 'text/html; charset=utf-8');
			result('jade');

});


 request(
    { method: 'HEAD',
      uri: 'http://'+testconf.hostname+':3000/static/b.js',},
    function(error, res, body) {
	  should.strictEqual(res.statusCode, 200);
	  should.strictEqual(res.headers['content-length'], '13');
    	result('head');
    })






