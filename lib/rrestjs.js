/*
*rrestjs主入口，各种模块的汇聚地
*
*/
_hasrrest = false; //全局变量，用来区分是否执行过rrest方法了

var mime = require('mime');
_restConfig = require('./configRequire');//加载config文件
restlog = require('./RestLogger');//加载日志记录
require('./checkConfig')(_restConfig);//检查config文件
require('./RestUtils').getVersion();//获取版本号
if(_restConfig.autoCreateFolders) var autoCreateFolders = require('./createFolders');//自动创建目录

var RestReq = require('./RestReq')(),//封装req
	RestRes = require('./RestRes')(),//封装res
	bridge = require('./RestBridge'),
	RestBridge = module.exports = function(callback){
							_hasrrest = true; 
							 return bridge(callback);
							};//输出核心函数
//http注入
require('./httpInject.js');

module.exports.AsyncProxy = require('./modules/AsyncProxy');//输出异步代理
module.exports.mongo = require('./MongdbConnect');//输出mongodb api
module.exports.mpool = require('./MongdbConnect').mpool;
module.exports.mgenid = require('./MongdbConnect').mgenid;//可以生产bson的_id
module.exports.config = _restConfig;
module.exports.mod = require('./AutoRequire');
module.exports.child = bridge._rrest;
module.exports.listen = bridge.listen;
module.exports.clientpipe = require('./RestPipe');//增加RestCross
module.exports.proxy = require('http-proxy');//加载了http-proxy代理，可以使用它的方法
module.exports.tploption = _restConfig.tploption = {};//默认的模版对象，会自动合并到每次render模版时
//增加less的mime格式
mime.define({'text/css':['less']});