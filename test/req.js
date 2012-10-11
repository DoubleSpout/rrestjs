/*
	基本测试，request 例子
	测试response，tploption，session的_csrf功能
*/
var should = require('should');
var path = require('path');
var testconf = require('./testconf.js');
module.exports.rrestjsconfig = {
	listenPort:3000,
	baseDir: path.join(__dirname)};
var http = require('http'),
	rrest = require('../'),
    server = http.createServer(rrest(function (req, res){

		should.strictEqual(req.path.join(), ['user', 'face', 'save', 'uid', '123456'].join());
		should.strictEqual(req.ip, testconf.hostname);
		should.strictEqual(req.referer, 'http://www.cnodejs.org/');
		should.strictEqual(req.referrer, req.referer);
		should.strictEqual(req.useragent, 'node.js-v0.8.8');
		should.strictEqual(JSON.stringify(req.getparam), JSON.stringify({ myquery1: '1',myquery2: '2',a: { x: '1', y: '2' }, b: [ '1', '2', '3', '4' ],c: '3' }));
		should.strictEqual(JSON.stringify(req.queryparam), JSON.stringify(req.getparam));
		should.strictEqual(JSON.stringify(req.bodyparam), JSON.stringify({ mypost1: '1', a: { x: '1', y: '2' },b: [ '1', '2', '3', '4' ],c: '3' }));
		should.strictEqual(JSON.stringify(req.postparam), JSON.stringify(req.bodyparam));
		should.strictEqual(JSON.stringify(req.cookie), JSON.stringify({ mycookie1: '123456', mycookie2:'abcdefg'}));
		should.strictEqual(req.isxhr, true);
		res.send('hello wrold');
	})).listen(rrest.config.listenPort);


var poststr = 'mypost1=1&a%5Bx%5D=1&a%5By%5D=2&b%5B%5D=1&b%5B%5D=2&b%5B%5D=3&b%5B%5D=4&c=3';
var zlib = require('zlib');
var unzip = zlib.createUnzip();
var request  = 	http.request({
		host:testconf.hostname,
		port:3000,
		path:'/user/face/save/uid/123456?myquery1=1&myquery2=2&a%5Bx%5D=1&a%5By%5D=2&b%5B%5D=1&b%5B%5D=2&b%5B%5D=3&b%5B%5D=4&c=3',
		method:'POST',
		headers:{'Accept':'text/html',
				 'Accept-Encoding':'gzip,deflate',
			     'Content-Type':'application/x-www-form-urlencoded', 
			     'Content-Length':poststr.length,
			     'User-Agent':'node.js-v0.8.8', 
			     'cookie':'mycookie1=123456; mycookie2=abcdefg', 
			     'X-Requested-With':'xmlhttprequest',
				 'Connection':'keep-alive',
			     'Referer':'http://www.cnodejs.org/'}
	}, function(res){
			var body = '';
			res.pipe(unzip)
			unzip.on('data', function(chunk) {
					// convert chunk to utf8 text:
					 body += chunk.toString('utf8');
					// process utf8 text chunk
				});
			unzip.on('end', function(chunk) {
					should.strictEqual(body, 'hello wrold');
					should.strictEqual(res.headers['content-length'], '31');
					should.strictEqual(res.headers['x-powered-by'], 'node.js');
					console.log('req.js test done!');
					process.exit();
				});
	}).on('err', function(e){
		throw e;
	});
	request.write(poststr);
	request.end();

