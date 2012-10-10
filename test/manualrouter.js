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
	}
};


var http = require('http');
var	rrest = require('../');
var server = http.createServer(rrest(function (req, res){
		//console.log(req.pathname)
		if(req.pathname === '/'){
			res.send('hello world') 
			return false;
		}	
	})).listen(rrest.config.listenPort);

http.globalAgent.maxSockets = 10;


var i = 7;
var r = 0
var result = function(name){
	var num = ++r;
	console.log('%s test done, receive %d/%d', name, num, i);
	if(num>=i){
		console.log('manal.js test done.')
		process.exit();
	}
}


request({
method:'post',
uri:'http://'+testconf.hostname+':3000/',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'hello world')
	result('root post')
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
}).form().append('my_field', 'my_value');;

request({
method:'post',
uri:'http://'+testconf.hostname+':3000/user/info/',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'get not access')
	result('post user info')
}).form().append('my_field', 'my_value');;


request({
method:'put',
uri:'http://'+testconf.hostname+':3000/user/info?b=1',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'get not access')
	result('put user info')
}).form().append('my_field', 'my_value');;

request({
method:'delete',
uri:'http://'+testconf.hostname+':3000/user/all/?a=1',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'all method can access')
	result('delete user all')
});














