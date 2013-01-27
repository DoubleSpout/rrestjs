/*
	基本测试， sep_session 例子
	对于有时间限制的session只能手动浏览器测试了
*/
var should = require('should');
var path = require('path');
module.exports.conf = {
		listenPort:3000,
		baseDir: path.join(__dirname),
		//cluster配置
		isCluster:true, //是否开启多进程集群
		ClusterNum:4, //开启的进程数
		//session配置
		isSession:true, //是否开启session，开启会影响性能。
		syncSession:true,//当多进程时是否开启session同步，开启会影响性能。
		sessionName:'rrSid', //保存session id 的cookie 的name
		sessionExpire:false, //false表示会话session，否则填入1000*60，表示session有效1分钟
		clearSessionSetInteval:1000*60*60, //自动清理垃圾session时间，建设设置为1小时
		clearSessionTime:1000*60*60*24,//会话session超时，建议设置为1天
		sepSession:['/user','/pay','/game']

	};
var http = require('http'),
	rrest = require('../../'),
	loop = 1;
    server = http.createServer(function (req, res){
        //console.log(req.pathname);
		if(loop>=5) return res.send('done');
		if(req.session.count>100){
			req.delsession();
			++loop;
			return res.send('del');
		}
		if(!req.session.count) req.session.count = 0;
		res.send(++req.session.count);
	}).listen(rrest.config.listenPort);



http.globalAgent.maxSockets = 20;

if(rrest.forkid == 'master'){

/*test sep session client*/
var count = 0;
var overfunc = function(){//结束函数
    count++;
    if(count>=4){
        console.log('sep session all test done')
        process.exit();
    }
    
}



var http = require('http');
var should = require('should');
var testconf = require('../testconf.js');
var cookies = '';
var obj = {
    i1:0,
    i2:0,
    i3:0,
    i4:0

}
var gorequest= function(param_cookie,pathurl,counti){
		var me = arguments.callee;
		var request  = 	http.request({
				host:testconf.hostname,
				port:3000,
				path:pathurl || '/',
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
						if(body == 'done') return console.log('sep session '+pathurl+' test done!') || overfunc();
						if(body == 'del'){
							counti=0;
							console.log('100 request '+pathurl+' has complete!')
							return me(null,pathurl,counti);
						}
						var session_i = ++counti;
						var session_count = body - 0;
						should.strictEqual(session_i, session_count);
						var setcookie = res.headers['set-cookie'];
						process.nextTick(function(){
							setTimeout(function(){me(setcookie, pathurl,counti);},400);
						});
					})
			}).on('err', function(e){
				throw e;
			});
			request.end();
		return me;
}

setTimeout(function(){
    gorequest(null,'/',obj.i1);
    gorequest(null,'/user',obj.i2);
    gorequest(null,'/pay/pay/aaa',obj.i3);
    gorequest(null,'/game/aaa/aaa',obj.i4);


},8000)

}


