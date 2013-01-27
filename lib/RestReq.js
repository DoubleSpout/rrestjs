/*
*RestReq.js 是对request对象进行封装，并最小化程度的污染命名空间 
*
*具体封装的属性和方法详见rrestjs api
*/
var http = require('http'),
	path = require('path'),
	url = require('url'),
	qs = require('qs'),
	RestUtils = require('./RestUtils'),
	normalize_query = RestUtils.normalize_query,//正常化用户请求的url路径去除../../等
	multipart = require('./Multipart'),
	RestSession = require('./RestSession'),
	msg =  require('./msg/msg'),
	genparamdot = require('./RestReqParam'),//拼装param对象
    sepSession = RestSession.sepSession,//分割session
    seplen = RestSession.sepSession?RestSession.sepSession.length:0,//预处理sepSession的长度
	isWindows = !!process.platform.indexOf('win'),//是否是windows
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
	_restParseUrl : function(){
		return url.parse(this.url);}, //拼装url，私有方法
	_restGetSession:function(callback){ //获得session
			var callback = callback || function(){};
            var that = this;

            if(sepSession){//如果开启了session的分割设置，则使用分割的sessionname
                var requrl =  that.pathname;
                var tempSeesionName = sessionName;
                for(var i=0;i<seplen;i++){
                    if(requrl.indexOf(sepSession[i])===0){

                        var sepPath = sepSession[i];
                         tempSeesionName = sessionName + '_' +sepPath.replace(/\//g,'');
                         that._sessionPath = sepPath;
                         break;
                     }
                }
            }
            var s_name = tempSeesionName || sessionName;
            that._sessionName = s_name;//客户端过来获取session的name

			var	sid = this.cookie[s_name];

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
				name : 'queryparam',
				get : that._restGetParam
			},
			{
				name : 'deleteparam',
				get : that._restPostParam
			},
			{
				name : 'postparam',
				get : that._restPostParam
			},
			{
				name : 'bodyparam',
				get : that._restPostParam
			},
			{
				name : 'putparam',
				get : that._restPostParam
			},
			{
				name : 'isxhr',
				get : that._isxhr
			},
			{
				name : 'cookie',
				get : that._restGetCookie
			}
		];
	},
	AnalyzeUrl:function(url){ //序列化请求地址，切割成数组，保证2个有效路径
			var	url = normalize_query(url || this._restParseUrl.pathname),//抵御相对路径攻击
				href = url.split('/').filter(function(val){return val != ''});
			this.pathname = ('/'+href.join('/')) || '/';
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
		var query = query || this._restParseUrl.query || '';
		//以下利用tj的qs模块即可
		return genparamdot(qs.parse(query));//处理带点的参数
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
	_isxhr:function(){ //返回是否是ajax xhr请求
		return 'xmlhttprequest' == (this.headers['x-requested-with'] || '').toLowerCase();
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
