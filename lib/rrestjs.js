/*
*rrestjs主入口，各种模块的汇聚地
*
*/
_restConfig = require('./configRequire');//加载config文件
restlog = require('./RestLogger');//加载日志记录
require('./checkConfig')(_restConfig);//检查config文件
require('./RestUtils').getVersion();//获取版本号
if(_restConfig.autoCreateFolders) var autoCreateFolders = require('./createFolders');//自动创建目录
var RestReq = require('./RestReq')(),//封装req
	RestRes = require('./RestRes')(),//封装res
	RestBridge = module.exports = require('./RestBridge');//输出核心函数
module.exports.AsyncProxy = require('./modules/AsyncProxy');//输出异步代理
module.exports.mongo = require('./MongdbConnect');//输出mongodb api
module.exports.mpool = require('./MongdbConnect').mpool;
module.exports.config = _restConfig;
module.exports.mod = require('./AutoRequire');
module.exports.id = RestBridge.id;
module.exports.listen = RestBridge.listen;
