/*
*ejsRender.js 是ejs模版输出的文件
*
*/
var ejs = require('ejs'),
	RestUtils = require('./RestUtils'),
	templateRender = require('./templateRender'),
	msg =  require('./msg/msg'),
	fs = require('fs'),
	outerror = require('./Outerror');
module.exports = function(res, view, ispage, options, fn){
	var cb = function(err, html){
		if(err) RestUtils.errorRes(res, msg.resmsg.ejsRenderError);//如果有错误响应500
		else templateRender.tempHeader(res, html).send(html);	
		fn(err, html);
	};
	compiler(res, view, ispage, options, cb);
}
var compiler = module.exports.compiler = function(res, view, ispage, options, callback){	
	if(!options.filename) options.filename =_restConfig.baseDir + _restConfig.tempFolder + view;//如果用户没有传递filename的key，则默认使用来的
	//如果用户没有传递filename的key，默认使用当前模版的路径
	templateRender(view, ispage, function(err, iscache, html){
			if(!err && !iscache) {
				var html = ejs.render(html, options);//如果没开启缓存，则编译ejs模版再输出							
			}
			callback(err, html);//如果是缓存，则直接输出html字符串
			return html;
	});
}

