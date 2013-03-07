/*
*checkConfig.js 文件是检查配置文件是否完整和符合规范
*
*会在app启动的时候先检查config文件
*
*/
var config = _restConfig,
	errors = 0,//错误总数
	warn = 0,//警告数量
	allnum = 0,//总检查数
	starting = function(){
		console.log('rrestjs process '+process.pid+' Checking config file starting...');
	},
	ending = function(){
		console.log('rrestjs process '+process.pid+' Config file checking complete, errors:'+errors+'/'+allnum+', warns:' + warn+ '/' +allnum);
	},
	checking = module.exports = function(conf){
		var conf = conf || config;
		starting();
		var keys = Object.keys(conf);//获取配置文件的key
		allnum = keys.length;
		keys.forEach(function(key){//遍历keys进行检查
			try{
				if(check[key](conf[key])) okfn(key);
			}
			catch(err){
				console.log('check config file error: '+err);
			}
		});
		ending();	
	},
	check = {
	//common
		server:function(val){
			if(!checkstring(val)) return errfn('server name must be a string, for example: rrestjs');
			return true;
		},
		poweredBy:function(val){
			if(!checkstring(val)) return errfn('poweredBy must be a string, for example: node.js');
			return true;
		},
		listenPort:function(val){
			if(!checknumber(val) && !checkarray(val)) return errfn('listenPort must be a number or a array, for example: 3000 or [3000, 3001, 3002, 3003]');
			return true;
		},
		baseDir:function(val){
			if(!checkpath(val)) return errfn('baseDir must be a valid url, for example: /usr/local/nodejs/app');
			return true;
		},
		autoCreateFolders:function(val){
			if(!checkboolean(val)) return errfn('autoCreateFolders must be a boolean');
			return true;
		},
		favicon:function(val){
			if(!checkpath(val)) return errfn('favicon must be a valid url, for example: /favicon.ico');
			return true;
		},
		charset:function(val){
			var ary = ['utf-8'];
			if(!checkinarray(val, ary)) return errfn('charset must be in ['+ary.join(',')+'] to lowercase');
			return true;
		},
		autoStatic:function(val){
			if(!checkpath(val)) return errfn('autoStatic must be a path, for example: /static');
			return true;
		},
		staticFolder:function(val){
			if(!checkpath(val)) return errfn('staticFolder must be a path, for example: /example/static');
			return true;
		},
		staticParse:function(val){
			if(!checkboolean(val)) return errfn('staticParse must be a boolean');
			return true;
		},
		staticParseName:function(val){
			if(!checkstring(val)) return errfn('staticParseName must be a string, for example: parse');
			return true;
		},
		staticParseCacheTime:function(val){
			if(!checknumber(val)) return errfn('staticParseCacheTime must be a number by million minute, for example: 1000*60*60 = 1 hour');
			return true;
		},
		staticParseCacheFolder:function(val){
			if(!checkpath(val)) return errfn('staticParseCacheFolder must be a path, for example: /tmp/static');
			return true;
		},
		staticParseMaxNumber:function(val){
			if(!checknumber(val)) return errfn('staticParseMaxNumber must be a number, for example: 10');
			return true;
		},
		uploadFolder:function(val){
			if(!checkpath(val)) return errfn('uploadFolder must be a path, for example: /tmp/upload');
			return true;
		},
		postLimit:function(val){
			if(!checknumber(val)) return errfn('postLimit must be a number by byte, for example: 1024*1024*100 = 1mb');
			return true;
		},
		connectTimeout:function(val){
			if(val !== false && !checknumber(val)) return errfn('connectTimeout must be false or a number, for example: false or 1000');
			return true;
		},
		autoRouter:function(val){
			if(val !== false && !checkpath(val)) return errfn('autoRouter must be false or a path, for example: /controller');
			return true;
		},
		manualRouter:function(val){
			if(val !== false && !("object" === typeof val)) return errfn('manualRouter must be false or an object,for example:{"get:/index/index":function(req, res){ res.send("hello world");}}');
			return true;
		},
	//cluster
		isCluster:function(val){
			if(!checkboolean(val)) return errfn('isCluster must be a boolean');
			return true;
		},
		isClusterAdmin:function(val){
			if(!checkboolean(val)) return errfn('isClusterAdmin must be a boolean');
			return true;
		},
		CLusterLog:function(val){
			if(!checkboolean(val)) return errfn('CLusterLog must be a boolean');
			return true;
		},
		adminListenPort:function(val){
			if(!checknumber(val)) return errfn('adminListenPort must be a number, for example: 20910');
			return true;
		},
		adminAuthorIp:function(val){
			if(!checkregexp(val)) return errfn('adminAuthorIp must be a RegExp, for example: /^10.1.49.223$/');
			return true;
		},
		ClusterNum:function(val){
			if(!checknumber(val)) return errfn('ClusterNum must be a number, for example: 8');
			return true;
		},
		ClusterReload:function(val){
			if(!checkpath(val)) return errfn('ClusterReload must be a path, for example: /controller');
			return true;
		},
		ClusterReloadExcept:function(val){
			if(!checkarray(val)) return errfn('ClusterReloadExcept must be a array, for example: [".swo", ".swp", ".swn", ".swx", ".bak"]');
			return true;
		},
		Heartbeat:function(val){
			if(!checknumber(val) && !checkboolean(val)) return errfn('Heartbeat must be a number or a boolean, for example: false or 1000*60');
			return true;
		},
		ClusterMaxMemory:function(val){
			if(!checknumber(val) && !checkboolean(val)) return errfn('ClusterMaxMemory must be a number or a boolean, for example: false or 100=100mb ');
			return true;
		},
//static
		staticMaxAge:function(val){
			if(!checknumber(val)) return errfn('staticMaxAge must be a number, for example:86400000*7 = 7 days');
			return true;
		},
		staticGetOnly:function(val){
			if(!checkboolean(val)) return errfn('staticGetOnly must be a boolean');
			return true;
		},
		staticLv2MaxAge:function(val){
			if(!checknumber(val)) return errfn('staticLv2MaxAge must be a number, for example:1000*60*60');
			return true;
		},
		staticLv2Number:function(val){
			if(!checknumber(val)) return errfn('staticLv2Number must be a number, for example:10000');
			return true;
		},
//session
		isSession:function(val){
			if(!checkboolean(val)) return errfn('isSession must be a boolean');
			return true;
		},
		syncSession:function(val){
			if(!checkboolean(val)) return errfn('syncSession must be a boolean');
			return true;
		},
		sessionName:function(val){
			if(!checkstring(val)) return errfn('sessionName must be a string, for example: rrSid');
			return true;
		},
		sessionExpire:function(val){
			if(val !== false && !checknumber(val)) return errfn('sessionExpire must be false or number, for example: false or 1000*60 = 60 minutes');
			return true;
		},
		clearSessionSetInteval:function(val){
			if(!checknumber(val)) return errfn('clearSessionSetInteval must be a number, for example: 1000*60*60');
			return true;
		},
		clearSessionTime:function(val){
			if(!checknumber(val)) return errfn('clearSessionTime must be a number, for example: 1000*60*60*24');
			return true;
		},
		sessionDbStore:function(val){
			if(!checkboolean(val)) return errfn('sessionDbStore must be a boolean');
			return true;
		},
        sepSession:function(val){
            if(val!==false && !checkarray(val)) return errfn('sepSession must be false or ["/user", "/pay", "/game"]');
            return true;
        },
//deflate gzip
		isZlib:function(val){
			if(!checkboolean(val)) return errfn('isZlib must be a boolean');
			return true;
		},
		ZlibArray:function(val){
			if(!checkarray(val)) return errfn("ZlibArray must be a array, for example: ['text/plain', 'application/javascript', 'text/css', 'application/xml', 'text/html']");
			return true;
		},
//logger log4js
		isLog:function(val){
			if(!checkboolean(val)) return errfn('isLog must be a boolean');
			return true;
		},		
		logLevel:function(val){
			var ary = ['trace','debug','info','warn','error', 'fatal'];
			if(!checkinarray(val, ary)) return errfn('logLevel must be in ['+ary.join(',')+'] tolowercase');
			return true;
		},
		logPath:function(val){
			if(!checkpath(val)) return errfn('logPath must be a path, for example: /mylogs');
			return true;
		},		
		logMaxSize:function(val){
			if(!checknumber(val)) return errfn('logMaxSize must be a number, for example: 1024*1024*10 = 10mb');
			return true;
		},
		logFileNum:function(val){
			if(!checknumber(val)) return errfn('logFileNum must be a number, for example: 10');
			return true;
		},
//template
		tempSet:function(val){
			var ary = ['jade','ejs'];
			if(!checkinarray(val, ary)) return errfn('tempSet must be in ['+ary.join(',')+'] to lowercase');
			return true;
		},		
		tempFolder:function(val){
			if(!checkpath(val)) return errfn('tempFolder must be a path, for example: /template/jade');
			return true;
		},
		tempHtmlCache:function(val){
			if(!checkboolean(val)) return errfn('tempHtmlCache must be a boolean');
			return true;
		},		
		tempCacheTime:function(val){
			if(!checknumber(val)) return errfn('tempCacheTime must be a number, for example: 1000*60*60 = 1 hour');
			return true;
		},
		tempCacheFolder:function(val){
			if(!checkpath(val)) return errfn('tempCacheFolder must be a path, for example: /tmp/template');
			return true;
		},
//mongodb 
		isMongodb:function(val){
			if(!checkboolean(val)) return errfn('isMongodb must be a boolean');
			return true;
		},
		MongodbIp:function(val){
			if(!checkip(val)) return errfn('MongodbIp must be a ip address, for example: 127.0.0.1');
			return true;
		},	
		MongodbPort:function(val){
			if(!checknumber(val)) return errfn('MongodbPort must be a number, for example: 27017');
			return true;
		},
		MongodbConnectString:function(val){
			if(val !== false && !checkstring(val)) return errfn('MongodbConnectString must be false or connect string.');
			return true;
		},
		MongodbConnectTimeout:function(val){
			if(!checknumber(val)) return errfn('MongodbConnectTimeout must be a number, for example: 1000*30 = 30 minutes');
			return true;
		},	
		MongodbMaxConnect:function(val){
			if(!checknumber(val)) return errfn('MongodbMaxConnect must be a number, for example: 50');
			return true;
		},
		MongodbDefaultDbName:function(val){
			if(!checkstring(val)) return errfn('MongodbDefaultDbName must be a string,  for example: rrest');
			return true;
		},
		MongodbRC:function(val){
			if(!checkstring(val)&&!checkboolean(val)) return errfn('MongodbRC must be a string or boolean,  for example: false or "Replic set name"');
			return true;
		},
		MongodbRChost:function(val){
			if(!checkarray(val)) return errfn('MongodbRChost must be a array,  for example: false or ["10.1.10.30:10001","10.1.10.31:27017"]');
			return true;
		},
		poolLogger:function(val){
			if(!checkboolean(val)) return errfn('poolLogger must be a boolean');
			return true;
		},
//AutoRequire
		AutoRequire:function(val){
			if(!checkboolean(val)) return errfn('AutoRequire must be a boolean');
			return true;
		},
		ModulesFloder:function(val){
			if(!checkpath(val)) return errfn('ModulesFloder must be a path, for example: /modules');
			return true;
		},
		ModulesExcept:function(val){
			if(!checkarray(val)) return errfn("ModulesExcept must be a array, for example:['captcha']");
			return true;
		},
//iptables
		IPfirewall:function(val){
			if(!checkboolean(val)) return errfn('IPfirewall must be a boolean');
			return true;
		},
		BlackList:function(val){
			if(!checkboolean(val)) return errfn('BlackList must be a boolean');
			return true;
		},
		ExceptIP:function(val){
			if(!checkregexp(val)) return errfn('ExceptIP must be a RegExp, for example: /^10.1.49.223$/');
			return true;
		},		
		ExceptPath:function(val){
			if(!checkarray(val)) return errfn("ExceptPath must be a array, for example:['/user']");
			return true;
		},
		NotAllow:function(val){
			if(!checkstring(val)) return errfn('NotAllow must be a string, for example: No permission!');
			return true;
		},
//isClientPipe
		isClientPipe:function(val){
			if(!checkboolean(val)) return errfn('isClientPipe must be a boolean');
			return true;
		}
	},
	okfn = function(val){
		//restlog.debug(val+'is ok!');
	},
	warnfn = function(msg){
		console.log(msg);
		warn++;
		return false;
	},
	errfn = function(msg){
		console.log(msg);
		errors++;
		return false;
	};
function checkip(val){
	if(!(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(val))) return false
	return true;
}
function checkstring(val){
	if(typeof val !== 'string') return false
	return true;
}
function checknumber(val){
	if(typeof val !== 'number') return false
	return true;
}
function checkarray(val){
	return Array.isArray(val);
}
function checkregexp(val){
	if(!(val instanceof RegExp)) return false
	return true;
}
function checkpath(val){
	var val = val.toString()||'' + '';
	if(val.indexOf('/') === -1) return false;
	else if(val.indexOf('/') !== 0) return false;
	else if(val.lastIndexOf('/') === val.length-1) return false;
	return true;
}
function checkboolean(val){
	if(typeof val !== 'boolean') return false;
	return true;
}
function checkinarray(val, array){
	if(array.indexOf(val) === -1) return false;
	return true;
}
