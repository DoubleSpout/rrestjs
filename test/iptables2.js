/*
	基本测试，iptable 黑名单 的例子
*/

var should = require('should');
var path = require('path');
var testconf = require('./testconf.js');
module.exports.rrestjsconfig = {
	listenPort:3000,
	autoRouter:'/controller',
	baseDir: path.join(__dirname),
	IPfirewall:true, //是否开启IP过滤，开启会影响性能。
	BlackList:true,//如果是true，表示下面这些是黑名单，如果是false，表示下面这些是白名单，路径设置优先级大于IP
	ExceptIP:new RegExp("^"+testconf.hostname+"$"), //正则表达式，匹配成功表示此IP可以正常访问,白名单
	ExceptPath:[],//例外的路径，如果用户访问这个url路径，无论在不在ip过滤列表中，都可以正常使用，白名单才能使用
	NotAllow:'No permission!', //禁止访问响应给客户端的信息	
	};
var http = require('http'),
	rrest = require('../'),
    server = http.createServer(function (req, res){
		res.send('get it')
	}).listen(rrest.config.listenPort);



var file = require('fs');
var i = 1;
var r = 0
var result = function(name){
	var num = ++r;
	console.log('%s test done, receive %d/%d', name, num, i);
	if(num>=i){
		console.log('iptables2.js blacklist test done.')
		process.exit();
	}
}

var getfn = function(path, cb){
	var request  = 	http.request({
			host:testconf.hostname,
			port:3000,
			path:'/'+path,
			method:'GET',
			headers:{'Accept':'text/html',
					 'Content-Type':'application/x-www-form-urlencoded', 
					 'Content-Length':'19',
					 'User-Agent':'node.js-v0.8.8', 
					 'cookie':'userid=123456; mycookie2=abcdefg', 
					 'X-Requested-With':'xmlhttprequest',
					 'Connection':'keep-alive',
					 'Referer':'http://www.cnodejs.org/'}
		}, function(res){
				var body = '';
				res.on('data', function(chunk) {
						// convert chunk to utf8 text:
						 body += chunk;
						// process utf8 text chunk
					});
				res.on('end', function() {
						cb(res, body);
					});
		}).on('err', function(e){
			throw e;
		});
		request.end();
}

getfn('/', function(res, body){
	should.strictEqual(res.statusCode, 403);
	result('blacklist');
});







