/*
*RestReq.js 是对request对象进行封装，并最小化程度的污染命名空间 
*
*具体封装的属性和方法详见rrestjs api
*/
var http = require('http'),
	path = require('path'),
	url = require('url'),
	RestUtils = require('./RestUtils'),
	multipart = require('./Multipart'),
	RestSession = require('./RestSession'),
	msg =  require('./msg/msg'),
	sessionName = RestSession.sessionName, //读取sessionname 
    RestReq = module.exports =  function(){
		if(!(this instanceof arguments.callee)) return new arguments.callee();
		this.Req = http.IncomingMessage.prototype;
		if(RestSession.isSession){
			this.Req.getsession = this._restGetSession; //设置getsession方法
			this.Req.delsession = this._restDelSession; //设置删除session方法
		}
		this.Req.GetMultiPost = function(callback){ //设置 GetMultiPost 方法，私有使用
				multipart(this, null, callback);
			};
		this.Req._restGetParamFunc = this._restGetParam;
		this._restDefine(this._restMakeMid()); //定义各种方法
	};
RestReq.prototype = {
	_restParseUrl : function(){return url.parse(this.url);}, //拼装url，私有方法
	_restGetSession:function(callback){ //获得session
			var callback = callback || function(){},
				sid = this.cookie[sessionName],
				that = this;
			if(!sid) return callback(msg.errmsg.sessionNoneError); //如果sid不存在则返回err
			return RestSession.getSession(sid, function(err, sobj){ //否则执行获得session方法
				that._restSessionObj = sobj; //将获得的 session 对象存入 req 对象的 _restSessionObj key 中
				callback(err, sobj); 
			});
		},
	_restDelSession:function(){
		var sid = this.cookie[sessionName];
			this._restRes.delsession(sid);
		},
	_restMakeMid:function(){
		var that = this; //为req对象添加的一些方法和属性
		return [
			{
				name:'_restParseUrl',
				get:that._restParseUrl		
			},
			{
				name : 'path',
				get : that.AnalyzeUrl
			},
			{
				name : 'ip',
				get : that._restGetIp
			},
			{
				name : 'referer',
				get : that._restGetReferer
			},
			{
				name : 'referrer',
				get : that._restGetReferer
			},
			{
				name : 'useragent',
				get : that._restGetUserAgent
			},
			{
				name : 'getparam',
				get : that._restGetParam
			},
			{
				name : 'deleteparam',
				get : that._restGetParam
			},
			{
				name : 'postparam',
				get : that._restPostParam
			},
			{
				name : 'putparam',
				get : that._restPostParam
			},
			{
				name : 'cookie',
				get : that._restGetCookie
			}
		];
	},
	AnalyzeUrl:function(url){ //序列化请求地址，切割成数组，保证2个有效路径
			var	url = url || this._restParseUrl.pathname,
				href = url.split('/').filter(function(val){return val != ''});
			if(href.length === 0) href = ['index','index']; //补足2个有效路径
			else if(href.length === 1) href.push('index');
			return href;
		},
	_restGetIp:function(){ //客户端IP地址
		return this.socket && (this.socket.remoteAddress || (this.socket.socket && this.socket.socket.remoteAddress));	
	},
	_restGetReferer:function(){ //获取来源
		return this.headers['referer'] || this.headers['referrer'] || '';
	},
	_restGetUserAgent:function(){ //获取用户信息
		return this.headers['user-agent'] || '';
	},
	_restGetParam:function(query){ //获取get的请求参数
		var param = {}, 
			query = query || this._restParseUrl.query || '';
	   query.split('&')
			.filter(function(val){ return val != ''})
			.forEach(function(val){
				var ParamArray = val.split('='),
					Pa;
				try{
					Pa = decodeURIComponent(ParamArray[1]);
				}
				catch(err){
					pa = ParamArray[1];
				}
				if(param[ParamArray[0]]) param[ParamArray[0]] += ','+ Pa;
				else param[ParamArray[0]] = Pa;
			});
		return param;
	},
	_restPostParam:function(callback){
		if(this.method !== 'POST' && this.method !== 'PUT')	return {};
		return 	this._restPostData; //multipart 模块会将 post 得到的参数传入这个对象
	},	
	_restGetCookie:function(){ //获取cookie对象
		 var cookie = this.headers.cookie || {};
		 if (!cookie) return cookie;
		 try {
			cookie = RestUtils.parseJSONCookies(RestUtils.parseCookie(cookie));
			return cookie;
		 }
		 catch(err){
			return {};
		 }
	},
	_restDefine:function(MidArray){ //逐个定义 MidArray 数组中的属性
		var that = this;
		MidArray.forEach(function(value, i){
			Object.defineProperty(that.Req, value.name, {set:function(newValue){
				 value.name = newValue;
				 },get:function(){
					return value.get.call(this);
				 },enumerable:false});				
		})
	}
}
