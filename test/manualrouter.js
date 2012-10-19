/*
	基本测试，手动路由 manual routrer 例子
*/
var should = require('should');
var request = require('request');
var path = require('path');
var testconf = require('./testconf.js');
module.exports.rrestjsconfig = {
	listenPort:3000,
	baseDir: path.join(__dirname),
	manualRouter:{	
	"get:/user/face":function(req, res){res.send('change face')},
	"post:put:/user/info":function(req, res){res.send('get not access')},
	"/user/all":function(req, res){res.send('all method can access')},
	"post:get:/user/info/{uid}":function(req, res){res.send('uid can access')},
	"put:post:/user/info/{uid}/{uname}/{sex}":function(req, res){res.send('uid uname sex can access')},
	}
};


var http = require('http');
var	rrest = require('../');
var server = http.createServer(function (req, res){
		//console.log(req.pathname)
		if(req.pathname === '/'){
			res.send('hello world');
			return false;
		}	
	}).listen(rrest.config.listenPort);

http.globalAgent.maxSockets = 10;


var i = 14;
var r = 0
var result = function(name){
	var num = ++r;
	console.log('%s test done, receive %d/%d', name, num, i);
	if(num>=i){
		console.log('manual.js test done.')
		process.exit();
	}
}


request({
method:'post',
uri:'http://'+testconf.hostname+':3000/',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'hello world')
	result('root post');
}).form().append('my_field', 'my_value');


request({
method:'get',
uri:'http://'+testconf.hostname+':3000/../../../',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'hello world')
	result('root post')
});

request({
method:'get',
uri:'http://'+testconf.hostname+':3000/user/face/',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'change face')
	result('get user face')
});

request({
method:'post',
uri:'http://'+testconf.hostname+':3000/user/face/',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 404);
	result('post user face')
}).form().append('my_field', 'my_value');

request({
method:'post',
uri:'http://'+testconf.hostname+':3000/user/info/',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'get not access')
	result('post user info')
}).form().append('my_field', 'my_value');


request({
method:'put',
uri:'http://'+testconf.hostname+':3000/user/info?b=1',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'get not access')
	result('put user info')
}).form().append('my_field', 'my_value');

request({
method:'delete',
uri:'http://'+testconf.hostname+':3000/user/all/?a=1',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'all method can access')
	result('delete user all')
});



request({
method:'post',
uri:'http://'+testconf.hostname+':3000/user/info/1234567890',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'uid can access')
	result('post uid can access')
}).form().append('my_field', 'my_value');


request({
method:'get',
uri:'http://'+testconf.hostname+':3000/user/info/4567890',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'uid can access')
	result('get uid can access')
});


request({
method:'put',
uri:'http://'+testconf.hostname+':3000/user/info/123/abc/male',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'uid uname sex can access')
	result('put dy url')
}).form().append('my_field', 'my_value');


request({
method:'post',
uri:'http://'+testconf.hostname+':3000/user/info/098/%&@_=+-_}{}{$~!+-_=/female',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'uid uname sex can access')
	result('post dy url')
}).form().append('my_field', 'my_value');


request({
method:'get',
uri:'http://'+testconf.hostname+':3000/user/info/098/%^&*@#$~!+-_=**/female',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 404);
	result('get not access url')
});

request({
method:'post',
uri:'http://'+testconf.hostname+':3000/user/info/123/abc/male/xxx',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 404);
	result('more url')
}).form().append('my_field', 'my_value');


request({
method:'post',
uri:'http://'+testconf.hostname+':3000/user/info/123/male',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 404);
	result('reduce url')
}).form().append('my_field', 'my_value');











