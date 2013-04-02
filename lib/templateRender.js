/*
*templateRender.js 通用模版输出模块，让jade或者ejs或者其他模版支持静态化html缓存
*
*exports  fn(view, ispage, fn)
*
*/
var RestUtils = require('./RestUtils'),
	fs = require('fs'),
	outerror = require('./Outerror'),
	msg =  require('./msg/msg'),
	charset = _restConfig.charset,
	tempobj = {									//config设置读入
		tempFolder : _restConfig.tempFolder,
		isCache : _restConfig.tempHtmlCache,
		CacheTime : _restConfig.tempCacheTime,
		CacheFolder : _restConfig.tempCacheFolder,
		BufferObj :{},
	},
	tempFolder = _restConfig.baseDir + tempobj.tempFolder;//缓存文件存放目录
tempobj.tempHeader =  function(res, html){//设置模版响应头
	var size = Buffer.byteLength(html, charset);
	res.setHeader('Content-Type', 'text/html; charset='+charset);
	res.setHeader('Content-Length', size);
	return res;
};
tempobj.renderFile = function(view, viewkey, fn, callback){//读取模版
		var path = tempFolder + view, //模版存放地址
			callback = callback || function(){},
			cb =  function(err, html){callback(err, view, viewkey, html);};
			fs.readFile(path, {encoding:charset}, function(err, data){
				var str = fn(err, false, data);//*这里需要jaderender等返回编译过后的html字符串代码
				cb(err, str);
			});
};
tempobj.genCache = function(err, view, viewkey, html){//生成缓存映射表
	if(err){
		if(tempobj.BufferObj[viewkey]) tempobj.BufferObj[viewkey].key = 1;
		return 
	}//如果输出jade模版出错，则将key归还映射表
	var jo = tempobj.BufferObj[viewkey],
		filename = jo.data = RestUtils.md5(viewkey); //生成文件名并将文件名放入 缓存映射表对应 viewkey 值的 key 中
		jo.timestamp = Date.now();//生成时间戳
	fs.writeFile(CacheFolder+'/'+filename, html, {encoding:charset}, function(err){//写入文件
		jo.key = 1;
		//node v0.10.2 可能存在bug，不执行回调
		if(err){//如果出错，则删除缓存映射表的这个key，记录错误日志
			delete tempobj.BufferObj[viewkey];
			outerror(msg.parse(msg.errmsg.templateWriteCacheError+view, err));
		}
	});
};
tempobj.sendCache = function(view, viewkey, fn){ //响应缓存
	var filename = CacheFolder + '/' +tempobj.BufferObj[viewkey].data; //拼装jade缓存文件地址
	fs.readFile(filename, {encoding:charset}, function(err, data){
		if(err){ //如果未找到缓存文件
			tempobj.renderFile(view, viewkey, fn, tempobj.genCache);//如果未找到文件则去生成文件
		}
		else fn(err, true, data)
	})
};
if(tempobj.isCache){//如果开启了jade html缓存
	var CacheFolder = _restConfig.baseDir + tempobj.CacheFolder;  //拼装jade缓存文件目录
	module.exports = function(view, ispage, fn){
			var viewkey = ispage  + view, //ispage表示页码，防止缓存根据模版路径名保存一个让所有分页缓存都指向一个页面的bug
				jo = tempobj.BufferObj[viewkey];//文件保存路径
			if(!jo){ //如果在缓存映射表中未找到记录
				jo = tempobj.BufferObj[viewkey] = {key:0}; //生成映射表，并且将 更新缓存的 key 取走
				tempobj.renderFile(view, viewkey, fn, tempobj.genCache);//这里直接读取jade模版，并将 tempobj.genCache 作为回调创建缓存，归还 key
			}
			else if(Date.now() - jo.timestamp >= tempobj.CacheTime && jo.key === 1){ //如果找到映射表中的记录，但是 缓存已经失效 并且 生成缓存的key 还在。
				jo.key = 0;
				tempobj.renderFile(view, viewkey, fn, tempobj.genCache); //取走 key 生成缓存
			}
			else if(jo && jo.key === 0){//在生成缓存时 阻止其他请求，防止缓存重建的雪崩
				fn(msg.errmsg.genCache);//返回 生成模版中的错误
			}
			else tempobj.sendCache(view, viewkey, fn); //否则输出缓存
	};
}
else module.exports = function(view, ispage, fn){//如果没有开启缓存
	tempobj.renderFile(view, ispage, fn, function(){});
}
module.exports.tempHeader = tempobj.tempHeader;