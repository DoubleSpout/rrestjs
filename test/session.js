/*
	基本测试， session 例子
	对于有时间限制的session只能手动浏览器测试了
*/
var should = require('should');
var path = require('path');
module.exports.rrestjsconfig = {
		listenPort:3000,
		baseDir: path.join(__dirname),
	//session配置
		isSession:true, //是否开启session，开启会影响性能。
		syncSession:false,//当多进程时是否开启session同步，开启会影响性能。
		sessionName:'rrSid' //保存session id 的cookie 的name
	};
var http = require('http'),
	rrest = require('../'),
	loop = 1;
    server = http.createServer(function (req, res){
		if(loop>=3) return res.send('done');
		if(req.session.count>50){
			req.delsession();
			++loop;
			return res.send('del');
		}
		if(!req.session.count) req.session.count = 0;		
		res.send(++req.session.count);
	}).listen(rrest.config.listenPort);



setTimeout(function(){
	require('./session/client.js')
},1000)


