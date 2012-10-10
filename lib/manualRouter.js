/*
rrestjs v1.0 新增功能，注册匹配路由
实例：
_restConfig.manualRouter = {
"get:put:post:/user/comein":function(req, res){res.send('hello wrold')}, //注册get，put，post，方法的路径
"/user/logout":function(req, res){res.send('goodbay!')}, //注册所有方法的路径
}
*/
var manual = _restConfig.manualRouter;
if(manual){
	var outerror = require('./Outerror'),
		msg =  require('./msg/msg'),
		manual_keys = Object.keys(manual),//获取所有注册的路由
		router = {};//存放路由对象
	manual_keys.forEach(function(v,i){
		var pos = v.indexOf('/'),
			method = v.slice(0, pos)
					  .split(':')
					  .filter(function(e){return !!e;})
					  .map(function(e){return e.toLowerCase();}),
			url = v.slice(pos),
			url_len = url.length;
		url = (url[url_len-1] === '/')?url.slice(0, url_len-1):url;//补完url路径
		if(method.length>0){
			method.forEach(function(m){
				if(router.hasOwnProperty(m)) return outerror(msg.errmsg.defineRouter);
				router[m+':'+url] = manual[v];//注册路由fn事件
			});
		}
		else router[url] = manual[v];
	});
	var match_url = module.exports = function(req, res){
		var m = req.method.toLowerCase(),
			p = req.pathname;
		if(router.hasOwnProperty(p)) return router[p](req, res);
		var	prop = m+':'+p;//拼接url
		if(router.hasOwnProperty(prop)) return router[prop](req, res);	 	
		res.r404();
	}
}
else module.exports = false;