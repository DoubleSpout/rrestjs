/*
	基本测试，response 例子
*/

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var should = require('should');
var fs = require('fs');
var request = require('request');
var path = require('path');
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
var	rrest = require('../');
var https = require('https');
var server = https.createServer(options, function (req, res){
		if(req.path[0] == 'upload'){
			res.sendjson({size:req.file.my_file.size, 
				name:req.file.my_file.name,
				type:req.file.my_file.type})
		}
		if(req.path[0] == 'big'){
			res.send('big');
		}
		if(req.path[0] == 'small'){
			res.send('small');
		}
		if(req.path[0] == 'huge'){
			res.send('huge');
		}
	}).listen(rrest.config.listenPort);

//设置全局的模版option
//https.globalAgent.maxSockets = 10;

var fs = require('fs');
var i = 4;
var r = 0
var result = function(name){
	var num = ++r;
	console.log('%s test done, receive %d/%d', name, num, i);
	if(num>=i){
		console.log('https upload.js test done.')
		process.exit();
	}
}

var png = fs.readFileSync(path.join(__dirname, '/static/octocat.png'));
var len = (new Buffer(png)).length;


request({
method:'post',
uri:'https://'+testconf.hostname+':3000/upload',
headers:{
	/*"content-length":500*/
}
}, function(error,res,body){
	should.strictEqual(body, '{"size":9311,"name":"octocat.png","type":"image/png"}')
	result('normal')
}).form().append('my_file', fs.createReadStream(path.join(__dirname, '/static/octocat.png')));



request({
method:'post',
uri:'https://'+testconf.hostname+':3000/big',
headers:{
}
}, function(error,res,body){
	should.strictEqual(res.statusCode, 400);
	result('big')
}).form().append('my_file', new Buffer(1024*1024*100));



request({
method:'post',
uri:'https://'+testconf.hostname+':3000/small',
headers:{
	"content-length":500
}
}, function(error,res,body){
	should.exist(error)
	result('small');
}).form().append('my_file', fs.createReadStream(path.join(__dirname, '/static/octocat.png')));


request({
method:'post',
uri:'https://'+testconf.hostname+':3000/huge',
headers:{
	"content-length":1024*1024*100
}
}, function(error,res,body){
	
	should.strictEqual(res.statusCode, 400);
	result('huge')
}).form().append('my_file',"123");















