/*
	基本测试，response 例子
*/
var should = require('should');
var path = require('path');
var testconf = require('./testconf.js');


module.exports.rrestjsconfig = {
	isCluster:true, //是否开启多进程集群
	isClusterAdmin:true,//进程监听管理功能是否开启
	adminListenPort:20910,//管理员监听端口号
	adminAuthorIp:/^127.0.0.1$/,//允许访问管理的IP地址
	ClusterNum:4, //开启的进程数


	listenPort:[4000,4001,4002,4003],
	baseDir: path.join(__dirname),
};


module.exports.rrestjsconfig_dev = {
	isCluster:true, //是否开启多进程集群
	isClusterAdmin:true,//进程监听管理功能是否开启
	adminListenPort:20910,//管理员监听端口号
	adminAuthorIp:/^127.0.0.1$/,//允许访问管理的IP地址
	ClusterNum:4, //开启的进程数


	listenPort:[3000,3001,3002,3003],
	baseDir: path.join(__dirname),
};


var http = require('http'),
	rrest = require('../'),
    server = http.createServer(function (req, res){
		res.send('listen port:'+rrest.config.listenPort+',id:'+rrest.forkid);
	}).listen(rrest.config.listenPort);




http.globalAgent.maxSockets = 20;




if(rrest.forkid == 'master'){


var i = 6;
var r = 0
var result = function(name){
	var num = ++r;
	console.log('%s test done, receive %d/%d', name, num, i);
	if(num>=i){
		console.log('multi listen test done.')
		process.exit();
	}
}

var getfn = function(path, port, cb){
	var request  = 	http.request({
			host:testconf.hostname,
			port:port||3000,
			path:'/'+path,
			method:'GET',
			headers:{}
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




setTimeout(function(){


getfn('', 3000, function(res, body){
		should.strictEqual(res.statusCode, 200);
		should.strictEqual(body, 'listen port:3000,id:0');
		result('3000 port complete');
});

getfn('', 3001, function(res, body){
		should.strictEqual(res.statusCode, 200);
		should.strictEqual(body, 'listen port:3001,id:1');
		result('3001 port complete');
});


getfn('', 3002, function(res, body){
		should.strictEqual(res.statusCode, 200);
		should.strictEqual(body, 'listen port:3002,id:2');
		result('3002 port complete');
});


getfn('', 3003, function(res, body){
		should.strictEqual(res.statusCode, 200);
		should.strictEqual(body, 'listen port:3003,id:3');
		result('3003 port complete');
});

getfn('', 20910, function(res, body){
		should.strictEqual(res.statusCode, 200);
		result('20910 port complete');
});

},1000*10);



	setTimeout(function(){
		var spawn = require('child_process').spawn;
		spawn('kill',['-9',rrest.config._workobj[0]]);
		setTimeout(function(){
				getfn('', 3000, function(res, body){
						should.strictEqual(res.statusCode, 200);
						should.strictEqual(body, 'listen port:3000,id:0');
						result('3000 restart port complete');
				});

		},3000)
		
	},1000*15)
}