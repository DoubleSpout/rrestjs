/*
	v0.9.2版本新增注入http模块，让用户不用每次都写rrest(fn)了

*/

var http = require('http'),
	RestBridge = require('./RestBridge'),
	Server = http.Server;

http.createServer = function(requestListener){
	if(rrest._hasrrest){
		return new Server(requestListener);
	}
	else{
		rrest._hasrrest = true;
		return new Server(RestBridge(requestListener));
	}
}