/*
*RestLogger.js 利用log4js来进行日志记录
*
*exports log日志记录对象，包含 trace,debug,error 等方法
*/
var inspect = require('util').inspect;

module.exports = function(){

	if(_restConfig.isLog){ //如果开启日志
		
		var restlogname = (_restConfig.isCluster && _restConfig.ClusterNum>=0)?'restlog_'+(_restConfig.pid||'main')+'.log':'restlog.log';
		var	log4js = require('log4js');//日志模块加载进来
		log4js.configure({//log4js配置
		 "appenders": [
			{ 
			  "category": _restConfig.server, 
			  "type": "logLevelFilter",
			  "level": _restConfig.logLevel,
			  "appender": {
				"type": "file",
				"filename": _restConfig.baseDir+_restConfig.logPath+'/'+restlogname, 
				"maxLogSize":_restConfig.logMaxSize,
				"backups":_restConfig.logFileNum,
			  }
			},
		 ],
		})//日志的配置
		 var restlog = log4js.getLogger(_restConfig.server);
		 return restlog;
	}
	else{
		var pid = (_restConfig.isCluster && _restConfig.ClusterNum>=0)?'[pid_'+(_restConfig.pid||'main')+']: ':'';
		
		var output = function(msg){
				if(typeof msg === "string") return console.log(pid+msg);
				try{
					console.log(pid+msg.message+' : '+msg.stack);
				}
				catch(e){}
			};

		var log = {}
		log.trace = log.debug = log.info = log.warn = log.error = log.fatal = output;
		return log;
	} 
}

