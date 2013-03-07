/*
*RestSession.js 是rrestjs框架session支持的模块
*
*包含了session的生成，更新，删除和session同步以及mongodb存储
*
*并最终统一api，改变session的存储以及同步关系只需要修改配置文件，而无需修改代码
*
*exports session对象，包含session的属性和方法
*/
var utils = require('./RestUtils'), 
    SessionMongodb = require('../lib/SessionMongodb'),
	msg =  require('./msg/msg'),
    sessionBuffer = {},//session存放变量，小型项目或者开发时候用这个，上线建议使用mongodb来存session
    RestSession = {
			isSession:_restConfig.isSession,
			syncSession : _restConfig.syncSession,
			sessionName:_restConfig.sessionName,
			sessionObj:sessionBuffer,
			expire:_restConfig.sessionExpire,
			count:0,
			stringTag:_restConfig.poweredBy,
			sessionDbStore:_restConfig.sessionDbStore,
			clearTime : _restConfig.clearSessionTime,
			clearSetInteval : _restConfig.clearSessionSetInteval,
			//mongodb support
			genfn : SessionMongodb.gen,
			getfn : SessionMongodb.get,
			updatefn : SessionMongodb.update,
			delfn : SessionMongodb.del,
			clearfn : SessionMongodb.clear,
			sepSession:_restConfig.sepSession
     };
rrest._restSession = sessionBuffer; //将sessionObj设置为全局变量

RestSession.genSession = function(obj, callback){//生成session 变量版本
	var _restsid = RestSession._genSession(RestSession.expire, obj, callback);
	return sessionBuffer[_restsid];
};
RestSession.genSessionDb = function(obj, callback){ //生成session mongodb版本
	RestSession.genfn(RestSession.expire, obj, callback);
}


RestSession._genSession = function(expire, obj, callback){//生成session 变量版本，实体函数
	var now = Date.now(),
		sidstring = now +''+(RestSession.count++)+RestSession.stringTag, //根据时间戳 和 count 生成sessionid
		_restsid = utils.md5(sidstring), //md5 字符串生成id
		sobj = sessionBuffer[_restsid] = obj;
		sobj._restexpire = expire;
		sobj._resttimestamp = now;
		sobj._restsid = _restsid;
	callback(null, _restsid, sobj);
	return _restsid;
}
RestSession.updateSession = function(_restsid, obj){ //更新session存放变量
	process.nextTick(function(){
		if(sessionBuffer[_restsid]){
			var now = Date.now();
			sessionBuffer[_restsid]._resttimestamp = now; //更新时间戳
			RestSession.sync('rrest._restSession["'+_restsid+'"]='+JSON.stringify(sessionBuffer[_restsid])); //同步session
		}
	});
	return _restsid;
};
RestSession.updateSessionDb = function(_restsid, obj){ //更新session mongodb版
	RestSession.updatefn(_restsid, obj);
}

RestSession.getSession = function(_restsid, callback){ //获得session对象
		var sobj = sessionBuffer[_restsid];
		if(!sobj){//未获取到 session
			callback(msg.errmsg.sessionNoneError);
			return false;
		}
		callback(null, sobj);
		return sobj
}
RestSession.getSessionDb = function(_restsid, callback){//获得session对象 mongodb版
	RestSession.getfn(_restsid, callback);
}


RestSession.delSession = function(_restsid){ //删除session 
	 process.nextTick(function(){
			 delete sessionBuffer[_restsid];		
			 RestSession.sync('delete rrest._restSession["'+_restsid+'"]');
	 });
};
RestSession.delSessionDb = function(_restsid){ //删除session  mongodb版
	RestSession.delfn(_restsid);
};

RestSession.sync = function(data){ //同步session，如果开启了同步并且同时开启了cluserplus才能使用此功能
	if(RestSession.syncSession && process.send) process.send({_sync:true, pid:process.pid, data:data});
};
RestSession.clearLoop = function(){ //定时清理过期的session，
	setInterval(function(){
		if(RestSession.sessionDbStore && RestSession.clearfn) RestSession.clearfn(RestSession.clearTime);
		else {
			var now = Date.now(),
				sobj,expire;
			for(var j in sessionBuffer){
				sobj = sessionBuffer[j];
				expire = !sobj._restexpire ? RestSession.clearTime : sobj._restexpire;
				if(sobj._resttimestamp + expire < now){
					delete rrest._restSession[j];
					RestSession.sync('delete rrest._restSession["'+j+'"]');
				}
			}
		}
	}, RestSession.clearSetInteval);
	return arguments.callee;
}();





if(RestSession.sessionDbStore){ //如果开启mongodb存储
	module.exports = {
		isSession : RestSession.isSession,
		sessionDbStore : RestSession.sessionDbStore,
		sessionName : RestSession.sessionName,
		expire : RestSession.expire,
		genSession : RestSession.genSessionDb,
		updateSession : RestSession.updateSessionDb,
		getSession : RestSession.getSessionDb,
		delSession : RestSession.delSessionDb,
        sepSession:RestSession.sepSession
	}
}
else{ //正常变量存储
	module.exports = {
		isSession : RestSession.isSession,
		sessionDbStore : RestSession.sessionDbStore,
		sessionName : RestSession.sessionName,
		expire : RestSession.expire,
		genSession : RestSession.genSession,
		updateSession : RestSession.updateSession,
		getSession : RestSession.getSession,
		delSession : RestSession.delSession,
        sepSession:RestSession.sepSession
	}
}