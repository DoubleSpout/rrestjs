/*
*RestClusterPlus.js 利用 ClusterPlus node.js cluster增加模块封装的多进程多任务管理 
*
*可以实现多进程监听多端口，也可以实现进程自动重启，不用频繁重启node做到开发node代码
*
*exports fn(option)
*/
var ClusterPlus = require('./modules/ClusterPlus'),
	RestUtils = require('./RestUtils'),
	outerror = require('./Outerror'),
	path = require('path'),
	msg =  require('./msg/msg'),
	isCluster = _restConfig.isCluster,
	ClusterNum = _restConfig.ClusterNum,
	CLusterLog = _restConfig.CLusterLog,
	ClusterReload = _restConfig.baseDir +_restConfig.ClusterReload; //监听改变重启的文件目录

if(!path.existsSync(ClusterReload)){//查找cluster文件夹是否存在
	outerror(msg.errmsg.clusterDirError);
	ClusterReload = _restConfig.baseDir;
}
module.exports = function(options){
	var cpobj = {//默认配置
		logger:CLusterLog,
		num:ClusterNum,
		reload:ClusterReload,
	}
	RestUtils.merge(cpobj, options);
	return ClusterPlus(cpobj); //实例化 ClusterPlus
}
