/*
*RestLogger.js 利用log4js来进行日志记录
*
*exports log日志记录对象，包含 trace,debug,error 等方法
*/

if(_restConfig.isLog){ //如果开启日志
	var	log4js = require('log4js');//日志模块加载进来
	log4js.configure({//log4js配置
	 "appenders": [
		{ 
		  "category": _restConfig.server, 
		  "type": "logLevelFilter",
		  "level": _restConfig.logLevel,
		  "appender": {
			"type": "file",
			"filename": _restConfig.baseDir+_restConfig.logPath, 
			"maxLogSize":_restConfig.logMaxSize,
			"backups":_restConfig.logFileNum,
		  }
		},
	 ],
	})//日志的配置
	var restlog = module.exports = log4js.getLogger(_restConfig.server);
}
else{
var log = module.exports = {}
	log.trace = log.debug = log.info = log.warn = log.error = log.fatal = function(msg){console.log(msg)};

} 

