/*
	基本测试，ejs 模版 测试 例子
*/
var should = require('should');
var request = require('request');
var path = require('path');
var testconf = require('./testconf.js');
module.exports.rrestjsconfig = {
	listenPort:3000,
	tempSet:'ejs',
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
			res.render('/ejs');
		}
		else if(pname === '/b'){
			res.render('/ejs.ejs', {"name":'hello world'});
		}
		else if(pname === '/c'){
			res.render('/ejs',function(err, html){//测试不加后缀名是否可以render成功
				chtml = html;
			});
		}
		else if(pname === '/d'){
			res.render('/ejs.ejs', {"name":'hello world'}, function(err, html){
				dhtml = html;
			});
		}
		else if(pname === '/e'){
			res.render('/ejs.ejs', 1, {"usersex":'hello world'});
		}
		else if(pname === '/f'){
			res.render('/ejs', 2, {}, function(err, html){
				fhtml = html;
			});
		}
		else if(pname === '/g'){
			res.compiletemp('/ejs.ejs', function(err, html){
				res.sendjson({'data':html});
			});
		}
		else if(pname === '/h'){
			res.compiletemp('/ejs.ejs', 3, {"name":'hello world'}, function(err, html){
				res.sendjson({'data':html});
			});
		}
        else if(pname === '/i'){
			res.compiletemp('/ejs2', 3, {"name":'hello world'}, function(err, html){
				res.sendjson({'data':html});
			});
		}
	}).listen(rrest.config.listenPort);

//设置全局的模版option
rrest.tploption.userid = function(req,res){return req.ip};
rrest.tploption.name = 'rrestjs default';
rrest.tploption.usersex = 'male';

http.globalAgent.maxSockets = 10;

var i = 9;
var r = 0
var result = function(name){
	var num = ++r;
	console.log('%s test done, receive %d/%d', name, num, i);
	if(num>=i){
		console.log('ejs.js test done.')
		process.exit();
	}
}

request({
method:'get',
uri:'http://'+testconf.hostname+':3000/a',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, '<li>rrestjs default</li><li>'+testconf.hostname+'</li><li>male</li><form></form>')
	result('/a request')
});



request({
method:'get',
uri:'http://'+testconf.hostname+':3000/b',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, '<li>hello world</li><li>'+testconf.hostname+'</li><li>male</li><form></form>')
	result('/b request')
});


request({
method:'get',
uri:'http://'+testconf.hostname+':3000/c',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, '<li>rrestjs default</li><li>'+testconf.hostname+'</li><li>male</li><form></form>');
	setTimeout(function(){
		should.strictEqual(chtml, '<li>rrestjs default</li><li>'+testconf.hostname+'</li><li>male</li><form></form>');
		result('/c request')
	},100)
	
});

request({
method:'get',
uri:'http://'+testconf.hostname+':3000/d',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, '<li>hello world</li><li>'+testconf.hostname+'</li><li>male</li><form></form>');
	setTimeout(function(){
		should.strictEqual(dhtml, '<li>hello world</li><li>'+testconf.hostname+'</li><li>male</li><form></form>');
		result('/d request')
	},100)
	
});

request({
method:'get',
uri:'http://'+testconf.hostname+':3000/e',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, '<li>rrestjs default</li><li>'+testconf.hostname+'</li><li>hello world</li><form></form>');
	result('/e request')
	
});


request({
method:'get',
uri:'http://'+testconf.hostname+':3000/f',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, '<li>rrestjs default</li><li>'+testconf.hostname+'</li><li>male</li><form></form>');
	setTimeout(function(){
		should.strictEqual(fhtml, '<li>rrestjs default</li><li>'+testconf.hostname+'</li><li>male</li><form></form>');
		result('/f request')
	},100)
});

request({
method:'get',
uri:'http://'+testconf.hostname+':3000/g',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, '{\"data\":\"<li>rrestjs default</li><li>'+testconf.hostname+'</li><li>male</li><form></form>\"}');
	result('/g request')
});

request({
method:'get',
uri:'http://'+testconf.hostname+':3000/h',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, '{\"data\":\"<li>hello world</li><li>'+testconf.hostname+'</li><li>male</li><form></form>\"}');
	result('/h request')
});



setTimeout(function(){
    rrest.ejs.open ='{{'
    rrest.ejs.close ='}}'
request({
method:'get',
uri:'http://'+testconf.hostname+':3000/i',
}, function(error, res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, '{\"data\":\"<li>hello world</li><li>'+testconf.hostname+'</li><li>male</li><form></form>\"}');
	result('/h request')
});


},1000)
