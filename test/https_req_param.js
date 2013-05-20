/*
	基本测试，req.param 的例子
*/
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var should = require('should');
var request = require('request');
var path = require('path');
var fs = require('fs');
var testconf = require('./testconf.js');
module.exports.rrestjsconfig = {
	listenPort:3000,
	tempSet:'ejs',
	tempFolder :'/static',
	postLimit:1024*1024*10,
    connectTimeout:1000,
	baseDir: path.join(__dirname),
};

var options = {
  key: fs.readFileSync('./key/key.pem'),
  cert: fs.readFileSync('./key/cert.pem')
};

var http = require('http');
var https = require('https');
var	rrest = require('../');
var server = https.createServer(options, function (req, res){
		if(req.path[0] == 'upload2'){
			if(req.param.my_file){
				delete req.param.my_file.path;
				delete req.param.my_file.lastModifiedDate
			}
			res.sendjson(req.param)
		}		
	}).listen(rrest.config.listenPort);

//设置全局的模版option
https.globalAgent.maxSockets = 10;

var fs = require('fs');
var i = 2;
var r = 0
var result = function(name){
	var num = ++r;
	console.log('%s test done, receive %d/%d', name, num, i);
	if(num>=i){
		console.log('https req_param.js test done.')
		process.exit();
	}
}

var png = fs.readFileSync(path.join(__dirname, '/static/octocat.png'));
var len = (new Buffer(png)).length;


var from = request({
method:'post',
uri:'https://'+testconf.hostname+':3000/upload2?number=123&getnumber=123',
headers:{
	/*"content-length":500*/
}
}, function(error,res,body){
	should.strictEqual(body, '{"number":"456","getnumber":"123","postnumber":"123","my_file":{"size":9311,"name":"octocat.png","type":"image/png","hash":false,"length":9311,"filename":"octocat.png","mime":"image/png"}}')
	result('req.param post')
}).form()
from.append('number','456')
from.append('postnumber','123')
from.append('my_file', fs.createReadStream(path.join(__dirname, '/static/octocat.png')));


 var bodyobj = { user: 
   { name: '123',
     sex: 'male',
     age: '11',
     score: { yuwen: '99', shuxue: '90', yingyu: '100' } },
  teacher: { name: 'yy', sex: 'female' },
  mypost1: '1',
  a: { x: '1', y: '2' },
  b: [ '1', '2', '3', '4' ],
  c: '3' }


var from = request({
method:'get',
uri:'https://'+testconf.hostname+':3000/upload2?mypost1=1&a%5Bx%5D=1&a%5By%5D=2&b%5B%5D=1&b%5B%5D=2&b%5B%5D=3&b%5B%5D=4&c=3&user.name=123&user.sex=male&user.age=11&user.score.yuwen=99&user.score.shuxue=90&user.score.yingyu=100&teacher.name=yy&teacher.sex=female',
}, function(error,res,body){
	should.strictEqual(body, JSON.stringify(bodyobj))
	result('req.param get')
});
















