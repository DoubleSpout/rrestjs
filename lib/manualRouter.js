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
		var urlzz = new RegExp('^'+url.replace(/\{[^\}]+\}/g, '([^/]+)')+'$');
		
		if(method.length>0){
			method.forEach(function(m){
				if(!router[m]) router[m] = [];
				router[m].push({
					func:manual[v],//注册路由fn事件
					zz:urlzz //匹配正则
					});
			});
		}
		else{
			if(!router['all']) router['all'] = [];
			router['all'].push({
					func:manual[v],//注册路由fn事件
					zz:urlzz //匹配正则
					}) 
		}
	});
	var rall = router['all'];

	var match_url = module.exports = function(req, res){
		var m = req.method.toLowerCase(),
			p = req.pathname;
		if(router[m]){
			for(var j=0,l=router[m].length; j<l; j++){
				var rmj = router[m][j];
				if(rmj.zz.test(p)) return rmj.func(req, res);		
			}
		}
		if(rall){
			for(var i=0,len=rall.length; i<len; i++){
				var rallmi = rall[i];
				if(rallmi.zz.test(p)) return rallmi.func(req, res);		
			}		
		}
		res.r404();	
	}
}
else module.exports = false;