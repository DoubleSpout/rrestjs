/*
*RestZlib.js 是gzip或者deflate压缩响应模块
*
*此模块会根据mimetype的值进行判断，是否进行delate或者gzip压缩
*
*exports fn(res, body, type)
*
*/
var zlib = require('zlib'), //加载gzip模块
	RestUtils = require('./RestUtils'),
    RestZlib  = {
		iszilb:_restConfig.isZlib, //全局设置是否开启gzip
	};
 RestZlib.send = function(res, body, type){
	if(!type) return res.end(body);//出错正常输出
	res.setHeader('Content-Encoding', type.toLowerCase());
	res.setHeader("Vary", "Accept-Encoding");//缓存服务器的正确响应
	zlib[type.toLowerCase()](body, function(err, data){ //调用delate或者gzip方法
		if(err) return res.end(body); //出错正常输出
		res.setHeader('Content-Length', data.length);
		data = RestUtils.headReq(res._restReq, data);
		res.end(data);
	})
	return true;
}	
 RestZlib.check = function(acceptEncoding){ //判断gzip
	if(!RestZlib.iszilb || !acceptEncoding) return false;
	if(~acceptEncoding.toLowerCase().indexOf('gzip')) return 'Gzip'; //优先使用deflate
	else if(~acceptEncoding.toLowerCase().indexOf('deflate')) return 'Deflate';
	return false;
 }
module.exports = RestZlib;