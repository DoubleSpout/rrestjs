/*
*RestStatic.js 是rrestjs框架静态文件输出的模块
*
*为res.sendfile提供了支持，主要功能是设置响应头，并且响应静态文件
*
*增加了静态文件的2次状态缓存，加速响应，减少i/o操作
*
*exports fn(res, path, cb)
*/
var fs = require('fs'),
    path = require('path'),
    RestUtils = require('./RestUtils'),
    Buffer = require('buffer').Buffer,
    mime = require('mime'),
	restzlib = require('./RestZlib'),
	msg =  require('./msg/msg'),
    RestStatic = {//读取配置文件
		option:{
			getOnly : _restConfig.staticGetOnly, 
			maxAge : _restConfig.staticMaxAge,
		},
		mtimeBuffer:{},//2级缓存，减少一次i/o操作
		Lv2MaxAge : _restConfig.staticLv2MaxAge,//2级缓存存在时间
		zlibArray :  _restConfig.ZlibArray, //选择性gzip输出
	};
RestStatic.setHeaders = function(res, option){ //设置各种静态响应头
	var charset = mime.charsets.lookup(option.type);
    if (!res.getHeader('Date')) res.setHeader('Date', new Date().toUTCString());
    if (!res.getHeader('Cache-Control')) res.setHeader('Cache-Control', 'public, max-age=' + (option.maxAge / 1000));
    if (!res.getHeader('Last-Modified')) res.setHeader('Last-Modified', option.mtime.utc);
    if (!res.getHeader('Content-Type')) res.setHeader('Content-Type', option.type + (charset ? '; charset=' + charset : ''));
    if (!res.getHeader('Etag')) res.setHeader('Etag', option.mtime.utcmd5);
	res.setHeader('Accept-Ranges', 'bytes');
};

RestStatic.sendfiles = function(req, res, filepath, stype, cb){ //输出文件的方法
var acceptEncoding = req.headers['accept-encoding'], //获取客户端是否支持gzip
	type = restzlib.check(acceptEncoding),
	stype = stype,	
	canZlib = RestStatic.zlibArray.some(function(value){//判断文件类型是否在gizp输出数组中
			return value == stype;		
		});
		fs.readFile(filepath, function(err, data){
				if(err){ //如果错误，则输出404
					RestUtils.errorRes404(res, msg.resmsg.notFound);
					return cb(err);
				}
				if(type && canZlib) restzlib.send(res, data, type); //gzip输出
				else{
					res.setHeader('Content-Length', data.length); //正常输出
					data = RestUtils.headReq(req, data);//如果是head请求，则值响应http头,返回空
					res.end(data);
				}
				cb();				
		});
};
RestStatic.ranges = function(res, ranges, stats, cb){ //ranges支持
	var len = stats.size,
		ranges = RestUtils.parseRange(len, ranges, cb),
		opts = {};
      if (ranges) {
        opts.start = ranges[0].start;
        opts.end = ranges[0].end;
        len = opts.end - opts.start + 1;
        res.statusCode = 206;
        res.setHeader('Content-Range', 'bytes '
          + opts.start
          + '-'
          + opts.end
          + '/'
          + stats.size);
      } else {
        cb('Range error:'+RestUtils.error(416));
		return false;
      }
	  return true;
}
RestStatic.ismodify = function(req, res, option, stats, filepath){ //判断是否让浏览器使用缓存
    if(res._nocache) return false;//如果手动设置res.cache(false)或者res.cache('public',-1)则表示不使用缓存
    
	var  UTC = stats.mtime instanceof Date ? stats.mtime.toUTCString() : stats.mtime.utc
	  option.mtime = {
		  utc : UTC,
		  utcmd5 : RestUtils.md5(UTC)
	  };
	 RestStatic.setHeaders(res, option);
	 RestStatic.mBuffer(filepath, option.mtime); //更新缓存或建立缓存
	 if(RestUtils.conditionalGET(req) && RestUtils.modified(req, res)){ 
		 RestUtils.notModified(res, option)
		return true;
		 }//如果已经缓存
	 else return false;
}

RestStatic.send = module.exports = function(res, filepath, cb){ //核心函数，主入口
	var option = RestUtils.merge({}, RestStatic.option),
	    cb = cb || function(){},
		req = res._restReq,
		mBuffer = RestStatic.mtimeBuffer,
		stype = option.type = mime.lookup(filepath),
		mtime;
	if(option.getOnly && 'GET' != req.method && 'HEAD' != req.method){
		var errstr = msg.resmsg.getOnlyError;
		RestUtils.forbidden(res, errstr);
		return cb(errstr); 
	}//如果不是get请求，则禁止
	if (mtime = mBuffer[filepath]){//如果找到2级缓存	
		if(RestStatic.ismodify(req, res, option, {mtime : mtime}, filepath)) return cb();	//响应304，客户端读取缓存
		RestStatic.sendfiles(req, res, filepath, stype, cb); //输出文件
	}
	else{ //如果没有找到2级缓存
			fs.stat(filepath, function(err, stats){
				  if (err){
					  RestUtils.errorRes404(res, msg.resmsg.notFound);
					  return cb(err);
				  }
				  else if (stats.isDirectory()){
					  RestUtils.errorRes404(res, msg.resmsg.notFound);
					  return cb(msg.errmsg.staticSendError);
				  }
				  if(RestStatic.ismodify(req, res, option, stats, filepath)) return cb(); //获取了状态判断是否缓存
				  var ranges = req.headers.range;
				  if(ranges){//如果是ranges
						if(RestStatic.ranges(res, ranges, stats, cb)) RestStatic.sendfiles(req, res, filepath, stype, cb);//如果ranges合法，则输出
				  }
				  else RestStatic.sendfiles(req, res, filepath, stype, cb);//如果不是ranges，则直接输出
			});	
		}
};
RestStatic.mBuffer = function(key, mtime){
	var mBuffer = RestStatic.mtimeBuffer;
	if(!mBuffer[key] && (++mBuffer.length > _restConfig.staticLv2Number)){
		 RestStatic.clearmBuffer();//如果mBuffer不存在，并且长度已经超过1000了，清空2级缓存Buffer
		}	
	mBuffer[key] = mtime;
};
RestStatic.clearmBuffer = function(){//清除2级缓存的方法
	RestStatic.mtimeBuffer = {
		length:0,
	}
};
RestStatic.loopClear = function(){ //定期清空2级缓存
	setInterval(function(){
		RestStatic.clearmBuffer();
	},RestStatic.Lv2MaxAge)
}();
