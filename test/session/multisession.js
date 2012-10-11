/*
	基本测试， session 例子
	对于有时间限制的session只能手动浏览器测试了
*/
var should = require('should');
var path = require('path');
module.exports.rrestjsconfig = {
		listenPort:3000,
		baseDir: path.join(__dirname),
		//cluster配置
		isCluster:true, //是否开启多进程集群
		ClusterNum:8, //开启的进程数
		//session配置
		isSession:true, //是否开启session，开启会影响性能。
		syncSession:true,//当多进程时是否开启session同步，开启会影响性能。
		sessionName:'rrSid', //保存session id 的cookie 的name
		sessionExpire:false, //false表示会话session，否则填入1000*60，表示session有效1分钟
		clearSessionSetInteval:1000*60*60, //自动清理垃圾session时间，建设设置为1小时
		clearSessionTime:1000*60*60*24,//会话session超时，建议设置为1天

	};
var http = require('http'),
	rrest = require('../../'),
	loop = 1;
    server = http.createServer(function (req, res){
		if(loop>=5) return res.send('done');
		if(req.session.count>100){
			req.delsession();
			++loop;
			return res.send('del');
		}
		if(!req.session.count) req.session.count = 0;		
		res.send(++req.session.count);
	}).listen(rrest.config.listenPort);