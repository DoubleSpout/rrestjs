/*
*rrestjs主入口，各种模块的汇聚地
*
*/

global.rrest = {} //占用全局命名空间


var program = require('commander');//引入commander模块

program 
  .option('-d, --dev', 'get in dev')
  .parse(process.argv);//注册-d

rrest._isrestdev = program.dev || false; //判断是否进入开发者模式





rrest._hasrrest = false; //全局变量，用来区分是否执行过rrest方法了

var mime = require('mime');
_restConfig = require('./configRequire');//加载config文件

require('./checkConfig')(_restConfig);//检查config文件

restlog = require('./RestLogger');

var version = require('./RestUtils').getVersion();//获取版本号
if(_restConfig.autoCreateFolders) var autoCreateFolders = require('./createFolders');//自动创建目录

var RestReq = require('./RestReq')(),//封装req
	RestRes = require('./RestRes')(),//封装res
	bridge = require('./RestBridge');

var rrestobj = function(callback){
							if(rrest._hasrrest) return;
							rrest._hasrrest = true; 		

							 return bridge(callback,true);
							};//输出核心函数

rrestobj.version = version;
module.exports = rrestobj;

//http注入
require('./httpInject.js');


if(bridge.restlog){
	global.restlog = module.exports.restlog = bridge.restlog;
}
module.exports.restlog = require('./RestLogger');//加载日志记录;//输出restlog的api
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
module.exports.forkid = process.env['_num'] || 'master';//如果没有_num则认为是master
module.exports.ejs = require('ejs');
module.exports.jade = require('jade');

//增加less的mime格式
mime.define({'text/css':['less']});


