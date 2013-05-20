/*
	v0.9.2版本新增注入http模块，让用户不用每次都写rrest(fn)了

*/

var http = require('http'),
	https = require('https'),
	outerror = require('./Outerror'),
	msg =  require('./msg/msg'),
	RestBridge = require('./RestBridge'),
	connectTimeout =_restConfig.connectTimeout,//连接超时时间
	Server = http.Server;
	Server_https = https.Server;

http.createServer = function(requestListener){
	if(rrest._hasrrest){
		var server =  new Server(requestListener);
	}
	else{
		rrest._hasrrest = true;
		var server =  new Server(RestBridge(requestListener));
	}

	connectTimeout && server.setTimeout && server.setTimeout(connectTimeout, function(socket){
		var remoteIp = (socket.remoteAddress || (socket.socket && socket.socket.remoteAddress))
        outerror('remoteIp: '+ remoteIp + ', '+ msg.errmsg.serverTimeout)
	})
	return server
}



https.createServer = function(options, requestListener){

	if(rrest._hasrrest){
		var server =  new Server_https(options, requestListener);
	}
	else{
		rrest._hasrrest = true;

		var new_listener = RestBridge(requestListener);
		var server =  new Server_https(options, new_listener);
	}


	return server
}

