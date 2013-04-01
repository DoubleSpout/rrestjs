/*
*Restbridge.js 是连接入口和框架核心的主要文件
*
*会根据配置文件不同，在加载时exports不同的fn，不用以后每次请求都去判断
*
*exports fn(cb)
*/

var forkid = process.env['_num'],
    parse = require('url').parse, //读取配置，加速加载
	http = require('http'),
	normalize = require('path').normalize,//正常化用户请求的url路径去除../../等
	events =  require("events"),//事件模块
	RestUtils = require('./RestUtils'),
	postLimit = require('./RestPostLimit'),//post方法的判断
	autoStatic = require('./autoStatic'),//自动响应静态文件判断
	RestAdmin = require('./RestAdmin.js'),//如果开启clusterplus，则会额外附送一个admin管理后台
	outerror = require('./Outerror'),
	clientpipe = require('./RestPipe'),//增加 clientpipe
	autoRouterFn = require('./autoRouter'),//自动路由函数
	manualRouter = require('./manualRouter'), //手动匹配路由
	genparamdot = require('./RestReqParam'),//拼装param对象
	apiJsonParse = require('./apiJson').parse,//解析json数据格式
	apiXmlParse = require('./apiXml').parse,//解析xml数据格式

	normalize_query = RestUtils.normalize_query,//正常化用户请求的url路径去除../../等
	version = RestUtils.version,
	merge = RestUtils.merge, //restutil工具中的合并对象的方法
	serverName = _restConfig.server+' / '+_restConfig._version,
	poweredBy = _restConfig.poweredBy,
	faviconUrl = _restConfig.favicon,
	staticStr = _restConfig.autoStatic,
	IPfirewall = _restConfig.IPfirewall,
	BlackList = _restConfig.BlackList,
	ExceptIP = _restConfig.ExceptIP,
	ExceptPath = _restConfig.ExceptPath,
	NotAllow = _restConfig.NotAllow,
	isSession = _restConfig.isSession,
	autoRouter = _restConfig.autoRouter,//是否自动路由
	manual = function(req, res){ //如果开启手动匹配路由则执行
		return manualRouter && manualRouter(req, res);	
	},
	worksession = function(req, res, callback){//获取session，可根据配置进行内存获取或者mongodb获取
		req.getsession(function(err, sobj){	
					if(err || !sobj){
						res.gensession({},function(err, obj){
							if(!err) req.session = obj;
							callback(req, res)!== false && manual(req, res);
						});
					} 
					else {
						req.session = sobj;
						callback(req, res)!== false && manual(req, res);
					}	
			});				
	},
	bridge = function(req, res, callback){//入口处,这里的callback就是用户编写的回调函数
		if(req.url === faviconUrl) res.favicon(); //如果是favicon请求，自动响应		
		else if(('/'+req.path[0]) === staticStr && (req.method === 'GET' || req.method === 'HEAD')){ //如果是请求静态文件，自动响应静态文件，这里为了效率只能设定一个静态目录
			if(!clientpipe.pipejs(req, res)) autoStatic(req, res);//自动响应静态文件
		}
		else if(req.method === 'POST' || req.method === 'PUT'){ //如果是POST或者PUT提交数据，则需要经过multiform
			postLimit(req, res, function(err, req, res){//判断post请求是否合理设置了content-length和超过大小
				if(err) return RestUtils.errorRes(res, err, 400);
				var head_accept = req.headers.accept||'',
					head_content = req.headers['content-type'];
					form_post = function(){		
						req._accept = 'xhtml';
						req.GetMultiPost(function(MultiForm){
							req.file = MultiForm.file;
							var postbody = merge(merge({},req.bodyparam),req.file);
							req.param = merge(merge({}, req.queryparam), postbody);//解析带点的参数提交
							if(isSession) worksession(req, res, callback);
							else callback(req, res)!== false && manual(req, res);
						});
					}

				if(!head_content || ~head_content.indexOf('x-www-form')) return form_post();
				
				head_accept = head_accept.toLowerCase();
                head_content = head_content.toLowerCase();
                
				var json_pos = head_accept.indexOf('json'),
					xml_pos = head_accept.indexOf('xml');
					//这里为了加速，只判断了位置，不判断了q的权重值				

				if(json_pos>xml_pos>0){//解析json
					req._accept = 'json';
					
				}
				else if(xml_pos>json_pos>0){//解析xml
					req._accept = 'xml';
					
				}
				
				if(~head_content.indexOf('json')){

					apiJsonParse(req, res, function(err){
						if(err) return RestUtils.errorRes(res, err, 400);
						if(isSession) worksession(req, res, callback);
						else callback(req, res)!== false && manual(req, res);
					});
				}
				else if(~head_content.indexOf('xml')){
					apiXmlParse(req, res, function(err){
						if(err) return RestUtils.errorRes(res, err, 400);
						if(isSession) worksession(req, res, callback);
						else callback(req, res)!== false && manual(req, res);
					});
				}
				else{					
					form_post();			
				}

			});				
		}
		else{
			if(isSession) worksession(req, res, callback);//如果打开session支持，则执行以下，会影响效率
			else callback(req, res) !== false && manual(req, res);
		}
	},
	setheader = function(req, res){
		res._restReq = req;  //让res也能取到req对象
		req._restRes = res;  //让req也能取到res对象
		res.setHeader('Server', serverName);//设置通用响应头
		res.setHeader('X-Powered-By', poweredBy);
		req.param = req.queryparam;
	},
	entrance = function(){
			if(IPfirewall){ //如果开启了IP过滤,影响效率
				return function(cb, notListen){
                        if(notListen) return cb();
						var callback = autoRouter ? autoRouterFn(cb) : cb;//判断是否开启自动路由
						return function(req, res){
							setheader(req, res);//设置头部
							if(ExceptPath.length>0){ //如果设置了例外的目录
								var uri = normalize_query(parse(req.url).pathname),
									allow = ExceptPath.some(function(val){
										return uri.indexOf(val) === 0;
									});
								if(!BlackList && allow) bridge(req, res, callback); //访问的是例外的目录，正常响应,白名单才使用
								else if(req.ip && (BlackList^ExceptIP.test(req.ip))) bridge(req, res, callback); //如果不再过滤路径内，但是ip在过滤内
								else RestUtils.forbidden(res, NotAllow);
							}
							else if(req.ip && (BlackList^ExceptIP.test(req.ip)))  bridge(req, res, callback);
							else RestUtils.forbidden(res, NotAllow);				
						}
				}
			}
			else{
				return function(cb,notListen){
                    if(notListen) return cb();
					var callback = autoRouter ? autoRouterFn(cb) : cb;//判断是否开启自动路由
						return function(req, res){
							setheader(req, res);
							bridge(req, res, callback);
						}
				}
			}
	}();
if(_restConfig.isCluster){//开启集群则输出以下函数
	var createWorker = new events.EventEmitter(),//实例化事件监听对象
		ClusterPlus =  require('./RestClusterPlus'),
		cp,//clusterplus对象
		_rrest={};
		module.exports = function(callback, notListen){
			var callback = callback || function(){};
				cp = ClusterPlus({
						CreateCallback:function(err, data){
							if(!err) {
								_restConfig.pid = data.pid;
								_rrest.id =  data.num;//将序号传递给work进程
							}
							RestAdmin.create(err, data);
						},
						DeadCallback:function(err, data){
							RestAdmin.dead(err, data);
						},
						RestartCallback:function(err, data){
							RestAdmin.restart(err, data);
						},
						num:_restConfig.ClusterNum,//开启的子进程数量
					});
					if(cp.isMaster){//如果是主进程

						
						_restConfig._worklistenPort = _restConfig.listenPort;

						_restConfig.listenPort =_restConfig.isClusterAdmin ? _restConfig.adminListenPort : null;
						
						_restConfig._workobj =  cp.workobj;//将工作的子进程号传递给 _rrest 对象
						_rrest.id = 'master';//如果是主进程，则需要将rrest.id设置为master
						callback = function(req, res){
							return RestAdmin(req, res);
						}
					}
                    else{
                        if( Array.isArray( _restConfig.listenPort)){
                             _restConfig.listenPort =  _restConfig.listenPort[forkid];
                        }
                       
                    }
            if(notListen) {
                process.nextTick(function(){
                    callback()
                })
            }
			else return entrance(callback);
	};

    
	module.exports._rrest = _rrest;


}
else{
	module.exports = entrance;//如果没有开启cluster集群则输出正常入口函数

}
	




