/*
*RestRes.js 是对response对象进行封装，并最小化程度的污染命名空间 
*
*具体封装的属性和方法详见rrestjs api
*/
var fs = require('fs'),
	http = require('http'),
    path = require('path'),
    RestUtils = require('./RestUtils'),
    mime = require('mime'),
	sendfile = require('./RestStatic'),
	sendfavicon = require('./RestFavicon'),
	restzlib = require('./RestZlib'),
	configZlib = _restConfig.isZlib,
	RestSession = require('./RestSession'),
	sessionName = RestSession.sessionName,
	tempSet = _restConfig.tempSet,
	JadeRender = require('./JadeRender'),
	ejsRender = require('./ejsRender'),
	outerror = require('./Outerror'),
	msg =  require('./msg/msg'),
	RestRes404 = require('./RestRes404.js'),
	RestRes_errorres = require('./RestRes404.js').errorres,
	apiXmlToString = require('./apiXml').ToString,//解析xml数据格式
	defaultcharset = _restConfig.charset,
	baseDir = _restConfig.baseDir,
    RestRes  = module.exports = function(){
		if(!(this instanceof arguments.callee)) return new arguments.callee();
		this.res = http.ServerResponse.prototype;
		this._restResMethod = ['cache', 'send', 'sendjson', 'sendjsonp', 'sendfile', 'file', 'contenttype', 'download', 'r404', 'r403', 'r500', 'attachment', 'set', 'get', 'clearcookie', 'cookie', 'cookiep3p', 'redirect', 'render', 'compiletemp', 'favicon', 'links', 'api'];
		if(RestSession.isSession) this._restResMethod.push('gensession', 'updatesession', 'delsession'); //如果开启session支持
		this._restdefine(this.res, this._restResMethod); //定义res对象的方法
  }; 
RestRes.prototype={
		_cache:function(res, type, maxAge){ //设置缓存头，如果想要此请求被缓存
              var type = type;
              if(type === false){
                  res._nocache = true;
                  return res;
              }
			  if (maxAge){
                  if(maxAge < 0){
                        type +=  ', max-age=-1';
                        res._nocache = true;
                  }
                  else{
                        type +=  ', max-age=' +  (maxAge / 1000);
                  }
              }
			  this._set(res, 'Cache-Control', type);
			  return res;
		},
		_send:function(res, body, statscode, iszlib, issession){ //核心函数，响应buffer或者字符串
				  var type,
					  req = res._restReq,
					  acceptEncoding = req.headers['accept-encoding'],
					  issession = 'undefined' == typeof issession? true : issession,
					  charset = res.charset || defaultcharset,
					  body = body || '';
                  if(typeof body === 'number') body += '';

				  if(statscode) res.statusCode = statscode;	//如果传递了http状态码
				  if(RestSession.isSession && issession) res.updatesession(req._restSessionObj); //更新session
				  if(204 == res.statusCode || 304 == res.statusCode) {
					res.removeHeader('Content-Type');
					res.removeHeader('Content-Length');
					body = '';
				  }
				  else if(!res.getHeader('Content-Type')) res.setHeader('Content-Type', 'text/html; charset='+charset);		
				  this._sercookie(res);//发送cookie
				  if('undefined' === typeof iszlib) var iszlib = configZlib;//如果未单独传递gizp，则使用默认规则
				  if(iszlib && (type = restzlib.check(acceptEncoding))) restzlib.send(res, body, type); //是否使用gizp输出
				  else{
                      if(typeof body === 'string'){
                           res.setHeader('Content-Length', Buffer.byteLength(body, charset));//增加content-length长度
                      }
                      else{
                           res.setHeader('Content-Length',body.length);//增加content-length长度
                      }
					  body = RestUtils.headReq(req, body);//如果是head请求，则值响应http头,返回空
					  res.end(body);//正常输出
				  }
				  return res;
		},
		_sendjson:function(res, obj, statscode, iszlib, issession){ //json字符串输出	  
				  this._contenttype(res, '.json');
				  this._send(res, JSON.stringify(obj), statscode, iszlib, issession);
				  return res;
		},
		_sendjsonp:function(res, obj, statscode, iszlib, issession){//jsonp支持，参数必须为小写的 callback
			var body = JSON.stringify(obj),
				callback = res._restReq.getparam['callback'];
			res.setHeader('Content-Type', 'text/javascript');
			if(callback){
				body = callback.replace(/[^\w$.]/g, '') + '(' + body + ');';
				this._send(res, body, statscode, iszlib, false);
			}
			else res.send(msg.resmsg.resJsonpError);
			return res;
		},
		_sendfile:function(res, filepath, callback){//响应文件
			if(!filepath) return callback(msg.errmsg.resFilepathError);
			sendfile(res, filepath, callback);
			return res;
		},
		_file:function(res, filepath, callback){//响应文件,这个api是输出相对于
			if(!filepath) return callback(msg.errmsg.resFilepathError);
			sendfile(res, baseDir+filepath, callback);
			return res;
		},
		_contenttype:function(res, filename){ //设置  Content-Type 的值
			 var charset = res.charset || defaultcharset;
			 res.setHeader('Content-Type', mime.lookup(filename)+'; charset='+charset);
			 return res;
		},
		_attachment:function(res, filename){ //设置下载头
			  if(filename) this._contenttype(res, filename);
			  res.setHeader('Content-Disposition', 'attachment; filename="' + path.basename(filename) + '"');
			  return this;
		},
		_download:function(res, filepath, fn){ //响应下载
				  this._attachment(res, filepath)._sendfile(res, filepath, fn);
				  return res;
		},
		_r404:function(res, filepath, fn){ //响应下载
			if (2 == arguments.length && 'function' === typeof filepath){
				var fn = filepath,
					filepath = false;
			}
				  RestRes404(res, filepath, fn);
				  return res;
		},
		_r403:function(res, fn){
			RestRes_errorres(res, fn, 403)
			return res;
		},
		_r500:function(res, fn){
			RestRes_errorres(res, fn, 500)
			return res;
		},
		_set:function(res, field, val){ //设置响应头
					if (3 == arguments.length) res.setHeader(field, val);
					else for (var key in field) res.setHeader(key, field[key]);
					return res;
		},
		_get:function(res, field){ //获得响应头
				res.getHeader(field);
				return res;
		},
		_clearcookie:function(res, name){  //清除cookie
				var opts = { expires: new Date(1), path: '/' };
				this._cookie(res, name, '', opts);
				return res;
		},
		_cookie:function(res, name, val, options){ //设置cookie
			var options = options || {};
			if ('object' == typeof val) val = 'j:' + JSON.stringify(val);
			if (options.maxAge) options.expires = new Date(Date.now() + options.maxAge);
			if (null == options.path) options.path = '/';
			var cookie = RestUtils.serializeCookie(name, val, options);
			if(!res._restcookieobj) res._restcookieobj = {};
			res._restcookieobj[name] = {
				name:name,
				val:val,
				options:options,
			}
			return res;
		},
		_cookiep3p:function(res){
			 res.setHeader('p3p', 'CP="CURa ADMa DEVa PSAo PSDo OUR BUS UNI PUR INT DEM STA PRE COM NAV OTC NOI DSP COR"')
			return res;
		},
		_sercookie:function(res){
			if(!res._restcookieobj) return;
			var cookiestr = '', co,coarray=[];
			for(var j in res._restcookieobj){
				co = res._restcookieobj[j];
				coarray.push(RestUtils.serializeCookie(j, co.val, co.options));
			}
			res.setHeader('Set-Cookie',  coarray);
		},
		_redirect:function(res, url, statecode){ //跳转
			  if(url == 'back') var url = res.get('Referrer')||'/';
			  this._set(res, {'Location':url, 'Content-Type':'text/plain'}).statusCode = statecode || 302;
			  this._cache(res, 'no-cache');
			  res.send(msg.tipsmsg.resRedirect + url);
			  return res;
		},
		_render:function(res, view, ispage, options, fn, iscompile){ //输出模版
			var arg = [].slice.call(arguments, 0),
				tpRender = iscompile? templateRender.compiler:templateRender.render;

			if(arg[1].indexOf('.') === -1){//如果不传.jade则默认加上后缀名
				arg[1] += '.'+tempSet;
			}

			arg = arg.filter(function(value){
				if('undefined' === typeof value || value === true) return false;
				return true;
			});
			if(view === 'auto'){
				var pathary = res._restReq.path;
				arg[1] = '/'+pathary[0]+'/'+pathary[1]+'.'+tempSet;//自动拼接模版地址
			}
			if(arg.length === 2){//如果只2个参数，view必传
				tpRender(arg[0], arg[1], '', {}, function(){});
			}
			else if(arg.length === 3){//传3个参数，则可能是options和fn
				if('function' === typeof arg[2]) tpRender(arg[0], arg[1], '', {}, arg[2]);
				else tpRender(arg[0], arg[1], '', arg[2], function(){});
			}					
			else if(arg.length === 4){//如果传递4个参数，则可能options后者fn没穿
				if('function' === typeof arg[3]) tpRender(arg[0], arg[1], '', arg[2], arg[3]);
				else tpRender(arg[0], arg[1], arg[2], arg[3], function(){});
			}
			else tpRender.apply(null, arg); //如果传递参数是4个，表示此页面无需分页，则ispage设置为空
			return res;
		},
		_compiletemp:function(res, view, ispage, options, fn){//编译模版
			var arg = [].slice.call(arguments, 0);
				arg[5] = true;
			this._render.apply(this, arg);
		},
		_favicon:function(res, filepath){ //输出favicon
			sendfavicon(res, filepath);		
			return res;
		},
		_gensession:function(res, obj, callback){ //创建sessionid入口
			var callback = callback || function(){},
				obj = obj || {};
			return RestSession.genSession(obj, function(err, _restsid, sobj){
                var reqobj = res._restReq;
				reqobj._restSessionObj = sobj; //更新req对象的 _restSessionObj 对象，因为第一次创建，否则为 undefined
                var sessionName = reqobj._sessionName;//设置sessionName，不使用默认配置的，为了支持sepSeesion
				res.cookie(sessionName, _restsid, {maxAge: RestSession.expire, path:reqobj._sessionPath || '/'}); //设置cookie
				callback(err, sobj);
			});
		},
		_updatesession:function(res, obj){ //更新session
			if(obj && obj._restsid){
				var _restsid = obj._restsid;
                var reqobj = res._restReq;
                var sessionName = reqobj._sessionName;//设置sessionName，不使用默认配置的，为了支持sepSeesion
				res.cookie(sessionName, _restsid, {maxAge: RestSession.expire, path:reqobj._sessionPath || '/'});
				RestSession.updateSession(_restsid, obj);
			}
			return res;
		},
		_delsession:function(res){ //删除session
			var _restsid = this._restgetSessionId(res);
			if(_restsid){
				res.cookie(sessionName, _restsid, {maxAge:-1});
				RestSession.delSession(_restsid);
			}
			return res;
		},
		_links:function(res, links){//copy from expressjs
				  return res.set('Link', Object.keys(links).map(function(rel){
					return '<' + links[rel] + '>; rel="' + rel + '"';
				  }).join(', '));
		},
		_api:function(res, obj){
			if(typeof obj !== 'object'){
				return RestUtils.errorRes(res, msg.errmsg.resapiError, 500);
			}
			
			var reqobj = res._restReq,
				that = this;

			if(reqobj._accept === 'xml'){
				apiXmlToString(obj, function(err, xml){
                    var charset = res.charset || defaultcharset;
					if(err) return RestUtils.errorRes(res, msg.errmsg.resapiError, 500);
					res.setHeader('Content-Type', 'application/xml; charset='+charset);
					res.send(xml);
				})
				
			}
			else{
				that._sendjson(res, obj)	
			}

		},
		_restgetSessionId:function(res){ //根据请求对象，获得sessionid
			return  RestUtils.parseJSONCookies(RestUtils.parseCookie(res._restReq.headers.cookie||''))[sessionName] || false;
		},
		_restdefine:function(res, array){ //定义res的方法
			var that = this;
			array.forEach(function(value, i){
				res[value] = (function(value){
					return function(){
						var arg = Array.prototype.slice.apply(arguments);
						arg.unshift(this);
						return that['_'+value].apply(that, arg);
					}
				})(value)
			});
		},
	};

var templateRender = function(){//选择模版输出
	var errfn = function(res){//否则模版设置错误
		RestUtils.errorRes(res, msg.resmsg.templateSetError);
	};
	if(tempSet === 'jade') return {render:JadeRender, compiler:JadeRender.compiler}; //输出jade模版
	else if(tempSet === 'ejs') return {render:ejsRender, compiler:ejsRender.compiler};//输出ejs模版
	else return {render:errfn, compiler:errfn};
}()
