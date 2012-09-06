(function(win){
var count=0;
var rrestnow = win.rrestpipe = win.now;
/*
调用node.js端add的方法，并且最后一个参数为回调函数接受返回值
例如：
rrestpipe.pipe('md5', 'abcde', function(err, md5str){
	if(!err) alert(md5str);
});
这样就直接调用了node.js端的md5方法生成密钥，当然也可以利用node.js生成一些密钥，加密串
最常见的就是 跨域请求了，这里rrestjs已经帮你做好了

rrestpipe.pipe('get', 'http://www.baidu.com', function(err, res){
	alert(res.header)
	alert(res.statusCode)
	alert(res.data)
})

*/
win.rrestpipe.pipe = function(){
	var nodefnname = arguments[0],
		param = [].slice.apply(arguments, [1]),
		len = param.length-1;
	if('function' !== typeof param[len]) param.push('nullfn');
	param[len] = genCallback(param[len]);
	rrestnow[nodefnname].apply(rrestnow, param);
}
	

/*注册事件，便于添加函数和事件让node.js端调用*/
win.rrestpipe.add = function(fnname ,fn){
	if(win.rrestpipe[fnname]) throw 'has aleady function at ' + fnname;
	win.rrestpipe[fnname] = rrestnow[fnname] = fn;
	return rrestnow;
}


var genCallback = function(cb){
	if(cb === 'nullfn') return cb;
	var cbname = '_rrestpipe'+(++count);
	rrestnow[cbname] = function(err, res){
		cb(err, res);
		delete rrestnow[cbname];
	};
	return cbname
}

}(window));