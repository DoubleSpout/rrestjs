/*
*restAdmin.js 是后台的controller 属于应用的文件
*
*exports fn(req, res)
*/
var outerror = require('./Outerror'),
	RestUtils = require('./RestUtils'),
	fs = require('fs'),
	msg =  require('./msg/msg'),
	adminAuthorIp = _restConfig.adminAuthorIp,	
	startTime = RestUtils.fdate('y-m-d h:m:s'),//应用启动时间
	logpath = _restConfig.baseDir+_restConfig.logPath,//获取日志存放路径
	adminobj = {
		delete:function(req, res){//杀死子进程
			if(req.method !== 'POST') return RestUtils.forbidden(res, 'Must has post method！');  
			var  result = _restConfig._workobj.some(function(value){return value == req.postparam.pid})
			if(result){
				process.kill(req.postparam.pid, 'SIGTERM');
				res.send('<h1>Has been killed <b>'+req.postparam.pid+' !</b><br/><a href="/">返回</a></h1>')
			}
			else RestUtils.forbidden(res, 'Pid error!');  
		},
		download:function(req, res){//下载日志文件
			if(req.method !== 'GET') return RestUtils.forbidden(res, 'Must has get method！');
			if(req.path[2] !== 'logger' || req.path.length>4) return RestUtils.forbidden(res, 'Download path error');
			res.download(logpath+'/'+req.path[3], function(err){
				if(err) return RestUtils.forbidden(res, 'down load error！');
			})
		},
		index:function(req, res){//输出模版
			if(req.method !== 'GET') return RestUtils.forbidden(res, 'Must has get method！');
			var loggerstr = '<a href="/index/download/logger/loggername">loggername</a>';
			fs.readFile(__dirname+'/admin/admin.html', 'utf-8', function (err, htmldata) {
				 if (err) return outerror('Read admin.html fail. '+err);
				 fs.readdir(logpath, function(err, files){//读取日志路径下的文件
					if (err) return outerror('Read logger dir fail. '+err);
					var loghtml = files.map(function(value){
						return loggerstr.replace(/loggername/g, value);
					}).join('<br/>');
					htmldata = htmldata.replace('$starttime', startTime);
					htmldata = htmldata.replace('$nowtime', RestUtils.fdate('y-m-d h:m:s'));
					htmldata = htmldata.replace('$listenport', _restConfig._worklistenPort);
					htmldata = htmldata.replace('$pid', _restConfig._workobj.join(', '));
					htmldata = htmldata.replace('$logger', loghtml);
					res.send(htmldata);
				 })
			 });
		}
	}

module.exports = function(req, res){//主入口
    if(!req || !res) return;

	if(!adminAuthorIp.test(req.ip)) return RestUtils.forbidden(res, 'Not allowed to access');
	if(req.path[0] !== 'index') return RestUtils.forbidden(res, 'No such admin path');
	try{
		adminobj[req.path[1]](req, res);//加载页面
	}
	catch(err){
		RestUtils.forbidden(res, 'No such admin path');
	}	
}
module.exports.create = function(err, data){};
module.exports.dead = function(err, data){};
module.exports.restart = function(err, data){};
