/*
	测试http请求是否超时
*/
var testconf = require('./testconf.js');
var should = require('should');
var path = require('path');
module.exports.rrestjsconfig = {
		listenPort:3000,
		baseDir: path.join(__dirname),
		connectTimeout:1000*5,
	};
var http = require('http'),
	rrest = require('../'),
	loop = 1;
    server = http.createServer(function (req, res){
		console.log('get post data!')

		setTimeout(function(){
			console.log("time out never be exec!")
			should.strictEqual(false,true);
		},1000*10)

		res.send("get data")
	}).listen(rrest.config.listenPort);




var options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/',
  method: 'POST',
  headers:{'Content-Type':'json',
		   'Transfer-Encoding':'chunked'
			}
};

var req = http.request(options, function(res) {

  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
  process.exit(0);
});

// write data to request body
req.write('{"a":"1"}');
//req.end();

setTimeout(function(){
	console.log('time out test done')
			process.exit(9)
},1000*10)