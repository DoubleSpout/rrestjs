/*
*createFolders.js �������Զ�����һЩĿ¼��
*
*������config�ļ��� autoCreateFolders ���������Ƿ�����
*/


var fs = require('fs'),
	path = require('path'),
	outerror = require('./Outerror'),
	msg =  require('./msg/msg'),
	baseDir = _restConfig.baseDir,
	folders = [//��Ҫ������Ŀ¼
		 _restConfig.staticFolder,
		_restConfig.staticParseCacheFolder,
		 _restConfig.uploadFolder,
		_restConfig.tempFolder,
		_restConfig.tempCacheFolder,
		_restConfig.ModulesFloder
	];
if(_restConfig.autoRouter) folders.push(_restConfig.autoRouter);//����һ���Զ�·��
var logPathAry = _restConfig.logPath.slice(1).split('/'),//��������mylog��·��
	logPath = logPathAry.slice(0, logPathAry.length-1).join('/');
folders.push('/'+logPath);

var folders = folders.forEach(function(value){//ѭ������Ŀ¼��������Ŀ¼
	var v =  value.slice(1).split('/'),
		ary = [];
	v.forEach(function(vname, i, v){
			var pathfolder = baseDir;
			for(var j = 0; j<=i; j++){
				pathfolder += '/'+v[j];
			}
			try{
				if(!fs.existsSync(pathfolder)){//����·�������ڣ������
					fs.mkdirSync(pathfolder);
				}			
			}
			catch(err){
				outerror(msg.parse(msg.errmsg.createFolderError+pathfolder, err));
			}
		});
	});

