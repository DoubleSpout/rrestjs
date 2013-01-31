/*
*RestPostLimit.js 是判断post的http请求头合法性模块
*
*当post请求 content-length 不存在或超大时报错
*
*当post请求 content-type 不存在报错
*
*exports fn(req, res, cb)
*/
var limit = _restConfig.postLimit,
	msg =  require('./msg/msg'),
	postLimit = module.exports = function (req, res, callback){//判断函数
		var received = 0,
			len = req.headers['content-length'] ? parseInt(req.headers['content-length'], 10) : null,
			type = req.headers['content-type'] || null,
		    ischunked = req.headers['transfer-encoding'] === 'chunked';
        req.ischunked = ischunked;
		if(!len && !ischunked) return callback(msg.resmsg.postError1, req, res);//不存在 content-length
		else if(!type) return callback(msg.resmsg.postError3, req, res);// content-type 不存在
		else if(ischunked) return callback(null, req, res);//如果是chunked，则不用去判断content-length了
		else if(len > limit) return callback(msg.resmsg.postError2, req, res);// content-length 超大		
		else return callback(null, req, res);
	};