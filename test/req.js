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
		should.strictEqual(req.ip, '192.168.11.66');
		should.strictEqual(req.referer, 'http://www.cnodejs.org/');
		should.strictEqual(req.referrer, req.referer);
		should.strictEqual(req.useragent, 'node.js-v0.8.8');
		should.strictEqual(JSON.stringify(req.getparam), JSON.stringify({myquery1:'1', myquery2:'2'}));
		should.strictEqual(JSON.stringify(req.queryparam), JSON.stringify(req.getparam));
		should.strictEqual(JSON.stringify(req.bodyparam), JSON.stringify({mypost1:'1', mypost2:'2'}));
		should.strictEqual(JSON.stringify(req.postparam), JSON.stringify(req.bodyparam));
		should.strictEqual(JSON.stringify(req.cookie), JSON.stringify({mycookie1:'123456', mycookie2:'abcdefg'}));
		should.strictEqual(req.isxhr, true);
		res.send('hello wrold');
	})).listen(rrest.config.listenPort);

var zlib = require('zlib');
var unzip = zlib.createUnzip();
var request  = 	http.request({
		host:testconf.hostname,
		port:3000,
		path:'/user/face/save/uid/123456?myquery1=1&myquery2=2',
		method:'POST',
		headers:{'Accept':'text/html',
				 'Accept-Encoding':'gzip,deflate',
			     'Content-Type':'application/x-www-form-urlencoded', 
			     'Content-Length':'19',
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
					should.strictEqual(res.headers['content-length'], 'hello wrold'.length+'');
					should.strictEqual(res.headers['server'], 'rrestjs / 0.8.1');
					should.strictEqual(res.headers['x-powered-by'], 'node.js');
					console.log('req.js test done!');
					process.exit();
				});
	}).on('err', function(e){
		throw e;
	});
	request.write('mypost1=1&mypost2=2');
	request.end();

