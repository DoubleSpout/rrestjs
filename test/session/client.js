var http = require('http');
var should = require('should');
var testconf = require('../testconf.js');
var cookies = '';
var i = 0;
var gorequest= function(param_cookie){
		var me = arguments.callee;
		var request  = 	http.request({
				host:testconf.hostname,
				port:3000,
				path:'/',
				method:'GET',
				headers:{'Accept':'text/html',
						 'Content-Type':'application/x-www-form-urlencoded', 
						 'Content-Length':'19',
						 'User-Agent':'node.js-v0.8.8', 
						 'cookie':param_cookie||'', 
						 'X-Requested-With':'xmlhttprequest',
						 'Connection':'keep-alive',
						 'Referer':'http://www.cnodejs.org/'}
			}, function(res){
					var body = '';
					res.on('data', function (chunk) {
						body += chunk;
					}).on('end', function(){
						if(body == 'done') return console.log('session test done!') || process.exit();
						if(body == 'del'){
							 i=0;
							console.log('100 request has complete!')
							return me();
						}
						var session_i = ++i;
						var session_count = body - 0;
						should.strictEqual(session_i, session_count);
						var setcookie = res.headers['set-cookie'];
						process.nextTick(function(){
							setTimeout(function(){me(setcookie);},400);
						});
					})
			}).on('err', function(e){
				throw e;
			});
			request.end();
		return me;
}()

