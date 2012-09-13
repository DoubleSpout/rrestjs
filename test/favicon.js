/*
	基本测试，hello world例子
*/
var should = require('should');
var path = require('path');
module.exports.rrestjsconfig = {
	listenPort:3000,
	baseDir: path.join(__dirname),
	favicon:'/static/favicon.ico',  //favicon存放地址		
	};
var http = require('http'),
	rrest = require('../'),
    server = http.createServer(rrest(function (req, res){
		res.send('hello wrold');
	})).listen(rrest.config.listenPort);







var fs = require('fs');
var fav = fs.readFileSync('./static/favicon.ico', 'hex');
http.get('http://192.168.11.66:3000/static/favicon.ico', function(res){
	var body='';
	res.on('data', function (chunk) {
		body += chunk.toString('hex');
	}).on('end', function(){
		should.strictEqual(body.toString('hex'), fav);
		console.log('favicon.js test done!');
		process.exit();
	})
}).on('err', function(e){
	throw e;
});