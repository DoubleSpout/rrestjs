/*
*AutoRequire.js 文件是自动加载模块
*
*自动加载过后的模块会保存在 require('rrestjs').mod 对象中
* 
*exports mod 对象
*/
var fs = require('fs'),
	outerror = require('./Outerror'),
	msg =  require('./msg/msg'),
	mod = module.exports = {},
	AutoRequire = function(){//自动加载模块函数
		if(_restConfig.AutoRequire){ //如果开启自动加载
			var path = _restConfig.baseDir + _restConfig.ModulesFloder, //自动加载模块目录
				except = _restConfig.ModulesExcept;//例外的数组		
				try{
					var filearray = fs.readdirSync(path);//读取加载目录路径
					if(filearray){						
						filearray.filter(function(value){
							return !except.some(function(exc){return value.indexOf(exc) != -1;}); //过滤例外
						}).forEach(function(value){
							if(~value.indexOf('.js')) var value = value.split('.js')[0];//去掉后缀名.js
							try{
								mod[value] = require(path+'/'+value);//加载模块
							}
							catch(e){
								outerror(msg.parse(msg.errmsg.notRequire+value, e));//捕获模块require错误
							}
						});
					}
				}
				catch(err){
					outerror(msg.parse(msg.errmsg.notFoundDir+path, err));//如果读取dir失败
				}
		}
		return arguments.callee;
	}();