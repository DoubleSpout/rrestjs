/*
	基本测试，jade 模版 测试 例子
*/
var should = require('should');
var request = require('request');
var path = require('path');
var testconf = require('./testconf.js');
module.exports.rrestjsconfig = {
	listenPort:3000,
	tempSet:'jade',
	tempFolder :'/static',
	baseDir: path.join(__dirname),
};

var chtml='';
var dhtml = '';
var fhtml = '';



var http = require('http'),
	rrest = require('../'), 
	i=0,
    server = http.createServer(function (req, res) {
		var pname = req.pathname;
		if(pname === '/a'){
			res.render('/jade');
		}
		else if(pname === '/b'){
			res.render('/jade.jade', {"name":'hello world'});
		}
		else if(pname === '/c'){
			res.render('/jade.jade',function(err, html){
				chtml = html;
			});
		}
		else if(pname === '/d'){
			res.render('/jade', {"name":'hello world'}, function(err, html){
				dhtml = html;
			});
		}
		else if(pname === '/e'){
			res.render('/jade.jade', 1, {"usersex":'hello world'});
		}
		else if(pname === '/f'){
			res.render('/jade.jade', 2, {}, function(err, html){
				fhtml = html;
			});
		}
		else if(pname === '/g'){
			res.compiletemp('/jade', function(err, html){
				res.sendjson({'data':html});
			});
		}
		else if(pname === '/h'){
			res.compiletemp('/jade.jade', 3, {"name":'hello world'}, function(err, html){
				res.sendjson({'data':html});
			});
		}
	}).listen(rrest.config.listenPort);

//设置全局的模版option
rrest.tploption.userid = function(req,res){return req.ip};
rrest.tploption.name = 'rrestjs default';
rrest.tploption.usersex = 'male';

http.globalAgent.maxSockets = 10;

var i = 8;
var r = 0
var result = function(name){
	var num = ++r;
	console.log('%s test done, receive %d/%d', name, num, i);
	if(num>=i){
		console.log('jade.js test done.')
		process.exit();
	}
}

request({
method:'get',
uri:'http://'+testconf.hostname+':3000/a',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'rrestjs default\n'+testconf.hostname+'\nmale\n<form></form>')
	result('/a request')
});



request({
method:'get',
uri:'http://'+testconf.hostname+':3000/b',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'hello world\n'+testconf.hostname+'\nmale\n<form></form>')
	result('/b request')
});


request({
method:'get',
uri:'http://'+testconf.hostname+':3000/c',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'rrestjs default\n'+testconf.hostname+'\nmale\n<form></form>');
	setTimeout(function(){
		should.strictEqual(chtml, 'rrestjs default\n'+testconf.hostname+'\nmale\n<form></form>');
		result('/c request')
	},100)
	
});

request({
method:'get',
uri:'http://'+testconf.hostname+':3000/d',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'hello world\n'+testconf.hostname+'\nmale\n<form></form>');
	setTimeout(function(){
		should.strictEqual(dhtml, 'hello world\n'+testconf.hostname+'\nmale\n<form></form>');
		result('/d request')
	},100)
	
});

request({
method:'get',
uri:'http://'+testconf.hostname+':3000/e',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'rrestjs default\n'+testconf.hostname+'\nhello world\n<form></form>');
	result('/e request')
	
});


request({
method:'get',
uri:'http://'+testconf.hostname+':3000/f',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, 'rrestjs default\n'+testconf.hostname+'\nmale\n<form></form>');
	setTimeout(function(){
		should.strictEqual(fhtml, 'rrestjs default\n'+testconf.hostname+'\nmale\n<form></form>');
		result('/f request')
	},100)
});

request({
method:'get',
uri:'http://'+testconf.hostname+':3000/g',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, '{\"data\":\"rrestjs default\\n'+testconf.hostname+'\\nmale\\n<form></form>\"}');
	result('/g request')
});

request({
method:'get',
uri:'http://'+testconf.hostname+':3000/h',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, '{\"data\":\"hello world\\n'+testconf.hostname+'\\nmale\\n<form></form>\"}');
	result('/h request')
});