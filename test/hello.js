/*
	基本测试，hello world例子
*/

var should = require('should');
var path = require('path');
module.exports.rrestjsconfig = {
	listenPort:3000,
	baseDir: path.join(__dirname)};
var http = require('http'),
	rrest = require('../'),
    server = http.createServer(rrest(function (req, res){
		res.send('hello wrold');
	})).listen(rrest.config.listenPort);

http.get('http://192.168.11.66:3000/', function(res){
	var body = '';
	res.on('data', function (chunk) {
		body += chunk;
	}).on('end', function(){
		should.strictEqual(body, 'hello wrold');
		console.log('hello.js test done!');
		process.exit();
	})
}).on('err', function(e){
	throw e;
});