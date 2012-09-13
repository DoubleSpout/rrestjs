var isClientPipe = _restConfig.isClientPipe;//这里设置是否打开
if(isClientPipe){//如果开启跨域功能则输出下面这些，如果没开启则输出空方法，防止出错
var nowjs  = require('now'),
	http = require('http'),
	fs = require('fs'),
	outerror = require('./Outerror'),
	msg =  require('./msg/msg'),
	vm = require('vm'),
	everyone,
	clientpipe={},
	clientpipefn = {};


//window.now = nowInitialize("//192.168.11.66:3000", {});多这句话
var nowjsclient = fs.readFileSync(__dirname+'/../node_modules/now/dist/now.js', 'utf-8')+'_rresttag';
var rrestpipejs = nowjsclient + fs.readFileSync(__dirname+'/client/clientpipe.js', 'utf-8');

/*
接受多个参数，主要依靠客户端，第一个为函数名，后面为参数
这里不要传递fn
例如 clientpipe.pipe('alert', 'myname', 'is', 'ok')
*/
	clientpipe.pipe = function(arg){
		var fn = arguments[0];
			param = [].slice.apply(arguments, [1]);
			everyone.now[fn].apply(everyone.now, param);//直接发送给客户端，这里没做callback处理
		return clientpipe;
	};
	
/*
注册同步事件，需要把返回值写入fn中
注意：不管是同步还是异步注册，都不能同名

参数：fnname 客户端使用的该函数名，匿名函数fn，将返回给客户端的值写入
例如：clientpipe.addsyn('sha1', function(str){
	var crypto = require('crypto');
	var shasum = crypto.createHash('sha1');
	shasum.update(str);
	return shasum.digest('hex');
});
//如果需要return多个请使用对象或者数组
这样客户端那边如果执行
rrestpipe.pipe('sha1', 'abcdefg', function(err, sha1){
	alert(sha1);
})
就可以弹出sha1的hex字符串了
*/
	clientpipe.addsyn = function(fnname, fn){
		if(clientpipefn[fnname]) return outerror(errmsg.addpipeError+fnname);
		clientpipefn[fnname] = fn;
		everyone.now[fnname] = function(){
			var len = arguments.length - 1,
				err = null,
			    param = [].slice.apply(arguments, [0, len]),
			    cbname = arguments[len];
			try{//同步的话用一个try catch就搞定了
				var result = fn.apply(null, param);
			}
			catch(e){
				err = e;
			}
			clientpipe.pipe(cbname, err, result);
		}
		return clientpipe;
	}
/*
注册异步事件,这里的异步是指服务端的异步，对于客户端都是异步，
需要把返回值写入参数callback中
和同步事件相比，会需要多传递一个参数
我们直接看例子,以下是注册一个get请求的例子
例如：clientpipe.addasy('get', function(url, asyback){
		var http=require('http');
			http.get(url, function(res){
				var body = '';
				res.on('data', function (chunk) {
					 body += chunk;
				 });
				 res.on('end', function(){
					asyback(null, {headers:res.headers, statusCode:res.statusCode, data:body});
				 });
			}).on('error', function(e) {
				asyback('get request error');
			});
	});
客户端还是一样调用：
rrestpipe.pipe('get', 'http://www.baidu.com', function(err, res){
	alert(res.header)
	alert(res.statusCode)
	alert(res.data)
})
*/

clientpipe.addasy = function(fnname, fn){
	if(clientpipefn[fnname]) return outerror(errmsg.addpipeError+fnname);
	clientpipefn[fnname] = fn;
	everyone.now[fnname] = function(){
		var len = arguments.length - 1,
			err = null,
			param = [].slice.apply(arguments, [0, len]),
			cbname = arguments[len];
		param.push(function(){//为回调函数某位增加一个 asyback 方法，便于异步回来时调用。
			var params = [].slice.apply(arguments, []);
			params.unshift(cbname);
			clientpipe.pipe.apply(null, params);
		});
		fn.apply(null, param);
	}
	return clientpipe;
}







clientpipe._ready = function(){
	require('./pipe/pipe.js');
	return clientpipe;
};



	module.exports = clientpipe.piper = function(server){//初始化整个项目，传入server对象
		everyone = nowjs.initialize(server);
		clientpipe._ready();
	};
	module.exports.addsyn = clientpipe.addsyn;//同步
	module.exports.addasy = clientpipe.addasy;//异步
	module.exports.pipe = clientpipe.pipe;//调用客户端函数的方法
	module.exports.fn = clientpipefn;//便于查看添加的所有异步和同步的管道方法

	module.exports.pipejs = function(req, res){
		if(req.path[req.path.length-1] == 'rrestpipe.js' ){
			res.setHeader('Content-Type','application/x-javascript');
			var host = req.headers.host.split(':');
			var pipejs = rrestpipejs.replace('_rresttag', 'window.now = nowInitialize("//'+host[0]+':'+(host[1] || 80)+'", {});');
			res.send(pipejs);
			return true;
		}			
		return false;
	}
}
else{
	module.exports = function(){}
	module.exports.pipejs = function(){return false;}
}