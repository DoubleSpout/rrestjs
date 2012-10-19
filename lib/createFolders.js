/*
*createFolders.js 是用来自动创建一些目录的
*
*可以在config文件的 autoCreateFolders 进行配置是否开启
*/


var fs = require('fs'),
	path = require('path'),
	outerror = require('./Outerror'),
	msg =  require('./msg/msg'),
	baseDir = _restConfig.baseDir,
	folders = [//需要创建的目录
		 _restConfig.staticFolder,
		_restConfig.staticParseCacheFolder,
		 _restConfig.uploadFolder,
		_restConfig.tempFolder,
		_restConfig.tempCacheFolder,
		_restConfig.ModulesFloder,
		_restConfig.logPath,
	];
if(_restConfig.autoRouter) folders.push(_restConfig.autoRouter);//处理一下自动路由

var createfn = module.exports = function(folders){
		var exitsfunc = fs.existsSync || path.existsSync;//支持0.8版本的api
		var folders = folders.forEach(function(value){//循环创建目录，包括父目录
			var v =  value.slice(1).split('/'),
				ary = [];
			v.forEach(function(vname, i, v){
					var pathfolder = baseDir;
					for(var j = 0; j<=i; j++){
						pathfolder += '/'+v[j];
					}
					try{
						if(!exitsfunc(pathfolder)){//如果路径不存在，则创建它
							fs.mkdirSync(pathfolder);
						}			
					}
					catch(err){
						outerror(msg.parse(msg.errmsg.createFolderError+pathfolder, err));
					}
				});
			});
		return arguments.callee;
}(folders);



