/*
*configRequire.js 是用来读取用户设置的config对象
*
*用户只需要在他的 app文件中   module.exports.conf = require('./config/config'); 
*
*然后在下面写上代码 var rrestjs = require('rrestjs');
*
*rrestjs即可读取到 用户设置的 config 对象
*
*用户可以根据改变conf的加载对象来改变生产环境、封测环境和开发环境
*/
 //require kinds of config files to change environment;
 //可以用下面的几个名字，随便选一个作为config名




var configName = ['config', '_config', 'conf', '_conf', 'rrestjsconfig', 'rrestconfig',  '_rrestjsconfig', '_rrestconfig', 'appconfig', '_appconfig'],
	exobj =  module.parent.parent.parent.exports,
	exobj_keys = Object.keys(exobj),
	RestUtils = require('./RestUtils'),
	default_config = require('../config/config');  


if(rrest._isrestdev){//如果开启开发者模式，则默认将命名增加_dev后缀
	configName = configName.map(function(v,i){
		return v+'_dev';
	})
}

if(exobj_keys.length === 0 ) module.exports = require('../config/config');

exobj_keys = exobj_keys.filter(function(value){ //匹配查找 configName 数组的变量名
	return configName.some(function(v){
		return value === v;
	})
});

if(exobj_keys.length > 0){
	module.exports = RestUtils.merge(default_config, exobj[exobj_keys[0]]);
}
else module.exports = default_config
