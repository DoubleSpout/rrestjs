/*
*Outerror.js 是rrestjs预定义的错误输出，会根据是否开启 日志 进行不同的输出情况
*
*exports fn(msg)
*/
var isLog = _restConfig.isLog,//是否开启日志
    restlogger = function(message){  //错误等级error
		restlog.error(message);
		return false;
	},
	restconsole = function(message){  //未开启日志功能
		console.log(message);
		return false;
	};
if(isLog) module.exports = restlogger;
else module.exports = restconsole;
