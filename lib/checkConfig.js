/*
*checkConfig.js 文件是检查配置文件是否完整和符合规范
*
*会在app启动的时候先检查config文件
*
*/
var config = _restConfig,
    errors = 0,//错误总数
    warn = 0,//警告数量
    allnum = 0;//总检查数
    starting = function() {
    restlog.debug('rrestjs process '+process.pid+' Checking config file starting...');
    },
    ending = function() {
        restlog.debug('rrestjs process '+process.pid+' Config file checking complete, errors:'+errors+'/'+allnum+', warns:' + warn+ '/' +allnum);
    },
	checking = module.exports = function(conf) {
        conf = conf || config;
        starting();
        var keys = Object.keys(conf);//获取配置文件的key
        allnum = keys.length;
        keys.forEach(function(key) {//遍历keys进行检查
            try{
                if (check[key](conf[key])) okFn(key);
            }
            catch(err) {
                restlog.debug('check config file error: '+err);
            }
        });
        ending();
    },
    check = {
    //common
        server: function(val) {
            if (!isString(val)) return errorFn('server name must be a string, for example: rrestjs');
            return true;
        },
        poweredBy: function(val) {
            if (!isString(val)) return errorFn('poweredBy must be a string, for example: node.js');
            return true;
        },
        listenPort: function(val) {
            if (!isNumber(val) && !isArray(val)) return errorFn('listenPort must be a number or a array, for example: 3000 or [3000, 3001, 3002, 3003]');
            return true;
        },
        baseDir: function(val) {
            if (!checkPath(val)) return errorFn('baseDir must be a valid url, for example: /usr/local/nodejs/app');
            return true;
        },
        autoCreateFolders: function(val) {
            if (!isBoolean(val)) return errorFn('autoCreateFolders must be a boolean');
            return true;
        },
        favicon: function(val) {
            if (!checkPath(val)) return errorFn('favicon must be a valid url, for example: /favicon.ico');
            return true;
        },
        charset: function(val) {
            var ary = ['utf-8'];
            if (!inArray(val, ary)) return errorFn('charset must be in ['+ary.join(',')+'] to lowercase');
            return true;
        },
        autoStatic: function(val) {
            if (!checkPath(val)) return errorFn('autoStatic must be a path, for example: /static');
            return true;
        },
        staticFolder: function(val) {
            if (!checkPath(val)) return errorFn('staticFolder must be a path, for example: /example/static');
            return true;
        },
        staticParse: function(val) {
            if (!isBoolean(val)) return errorFn('staticParse must be a boolean');
            return true;
        },
        staticParseName: function(val) {
            if (!isString(val)) return errorFn('staticParseName must be a string, for example: parse');
            return true;
        },
        staticParseCompress: function(val) {
            if (!isBoolean(val)) return errorFn('staticParseCompress must be a boolean.')
        },
        staticParseCacheTime: function(val) {
            if (!isNumber(val)) return errorFn('staticParseCacheTime must be a number by million minute, for example: 1000*60*60 = 1 hour');
            return true;
        },
        staticParseCacheFolder: function(val) {
            if (!checkPath(val)) return errorFn('staticParseCacheFolder must be a path, for example: /tmp/static');
            return true;
        },
        staticParseMaxNumber: function(val) {
            if (!isNumber(val)) return errorFn('staticParseMaxNumber must be a number, for example: 10');
            return true;
        },
        uploadFolder: function(val) {
            if (!checkPath(val)) return errorFn('uploadFolder must be a path, for example: /tmp/upload');
            return true;
        },
        postLimit: function(val) {
            if (!isNumber(val)) return errorFn('postLimit must be a number by byte, for example: 1024*1024*100 = 1mb');
            return true;
        },
        connectTimeout: function(val) {
            if (val !== false && !isNumber(val)) return errorFn('connectTimeout must be false or a number, for example: false or 1000');
            return true;
        },
        autoRouter: function(val) {
            if (val !== false && !checkPath(val)) return errorFn('autoRouter must be false or a path, for example: /controller');
            return true;
        },
        manualRouter: function(val) {
            if (val !== false && !("object" === typeof val)) return errorFn('manualRouter must be false or an object,for example:{"get:/index/index": function(req, res) { res.send("hello world");}}');
            return true;
        },
    //cluster
        isCluster: function(val) {
            if (!isBoolean(val)) return errorFn('isCluster must be a boolean');
            return true;
        },
        isClusterAdmin: function(val) {
            if (!isBoolean(val)) return errorFn('isClusterAdmin must be a boolean');
            return true;
        },
        CLusterLog: function(val) {
            if (!isBoolean(val)) return errorFn('CLusterLog must be a boolean');
            return true;
        },
        adminListenPort: function(val) {
            if (!isNumber(val)) return errorFn('adminListenPort must be a number, for example: 20910');
            return true;
        },
        adminAuthorIp: function(val) {
            if (!isRegExp(val)) return errorFn('adminAuthorIp must be a RegExp, for example: /^10.1.49.223$/');
            return true;
        },
        ClusterNum: function(val) {
            if (!isNumber(val)) return errorFn('ClusterNum must be a number, for example: 8');
            return true;
        },
        ClusterReload: function(val) {
            if (!checkPath(val)) return errorFn('ClusterReload must be a path, for example: /controller');
            return true;
        },
        ClusterReloadExcept: function(val) {
            if (!isArray(val)) return errorFn('ClusterReloadExcept must be a array, for example: [".swo", ".swp", ".swn", ".swx", ".bak"]');
            return true;
        },
        Heartbeat: function(val) {
            if (!isNumber(val) && !isBoolean(val)) return errorFn('Heartbeat must be a number or a boolean, for example: false or 1000*60');
            return true;
        },
        ClusterMaxMemory: function(val) {
            if (!isNumber(val) && !isBoolean(val)) return errorFn('ClusterMaxMemory must be a number or a boolean, for example: false or 100=100mb ');
            return true;
        },
//static
        statciMaxAge: function(val) {
            if (!isNumber(val)) {
                return errorFn('statciMaxAge must be a number, for example:86400000*7 = 7 days');
            }
            // 折中方案，向下兼容
            config.staticMaxAge = val;
            warnFn('statciMaxAge is changed to staticMaxAge now!')
            return true;
        },
        staticMaxAge: function(val) {
            if (!isNumber(val)) {
                return errorFn('staticMaxAge must be a number, for example:86400000*7 = 7 days');
            }
            return true;
        },
        staticGetOnly: function(val) {
            if (!isBoolean(val)) return errorFn('staticGetOnly must be a boolean');
            return true;
        },
        staticLv2MaxAge: function(val) {
            if (!isNumber(val)) return errorFn('staticLv2MaxAge must be a number, for example:1000*60*60');
            return true;
        },
        staticLv2Number: function(val) {
            if (!isNumber(val)) return errorFn('staticLv2Number must be a number, for example:10000');
            return true;
        },
//session
        isSession: function(val) {
            if (!isBoolean(val)) return errorFn('isSession must be a boolean');
            return true;
        },
        syncSession: function(val) {
            if (!isBoolean(val)) return errorFn('syncSession must be a boolean');
            return true;
        },
        sessionName: function(val) {
            if (!isString(val)) return errorFn('sessionName must be a string, for example: rrSid');
            return true;
        },
        sessionExpire: function(val) {
            if (val !== false && !isNumber(val)) return errorFn('sessionExpire must be false or number, for example: false or 1000*60 = 60 minutes');
            return true;
        },
        clearSessionSetInteval: function(val) {
            if (!isNumber(val)) return errorFn('clearSessionSetInteval must be a number, for example: 1000*60*60');
            return true;
        },
        clearSessionTime: function(val) {
            if (!isNumber(val)) return errorFn('clearSessionTime must be a number, for example: 1000*60*60*24');
            return true;
        },
        sessionDbStore: function(val) {
            if (!isBoolean(val)) return errorFn('sessionDbStore must be a boolean');
            return true;
        },
    //deflate gzip
        isZlib: function(val) {
            if (!isBoolean(val)) return errorFn('isZlib must be a boolean');
            return true;
        },
        ZlibArray: function(val) {
            if (!isArray(val)) return errorFn("ZlibArray must be a array, for example: ['text/plain', 'application/javascript', 'text/css', 'application/xml', 'text/html']");
            return true;
        },
    //logger log4js
        isLog: function(val) {
            if (!isBoolean(val)) return errorFn('isLog must be a boolean');
            return true;
        },
        logLevel: function(val) {
            var ary = ['trace','debug','info','warn','error', 'fatal'];
            if (!inArray(val, ary)) return errorFn('logLevel must be in ['+ary.join(',')+'] tolowercase');
            return true;
        },
        logPath: function(val) {
            if (!checkPath(val)) return errorFn('logPath must be a path, for example: /mylogs');
            return true;
        },
        logMaxSize: function(val) {
            if (!isNumber(val)) return errorFn('logMaxSize must be a number, for example: 1024*1024*10 = 10mb');
            return true;
        },
        logFileNum: function(val) {
            if (!isNumber(val)) return errorFn('logFileNum must be a number, for example: 10');
            return true;
        },
    //template
        tempSet: function(val) {
            var ary = ['jade','ejs'];
            if (!inArray(val, ary)) return errorFn('tempSet must be in ['+ary.join(',')+'] to lowercase');
            return true;
        },
        tempFolder: function(val) {
            if (!checkPath(val)) return errorFn('tempFolder must be a path, for example: /template/jade');
            return true;
        },
        tempHtmlCache: function(val) {
            if (!isBoolean(val)) return errorFn('tempHtmlCache must be a boolean');
            return true;
        },
        tempCacheTime: function(val) {
            if (!isNumber(val)) return errorFn('tempCacheTime must be a number, for example: 1000*60*60 = 1 hour');
            return true;
        },
        tempCacheFolder: function(val) {
            if (!checkPath(val)) return errorFn('tempCacheFolder must be a path, for example: /tmp/template');
            return true;
        },
    //mongodb
        isMongodb: function(val) {
            if (!isBoolean(val)) return errorFn('isMongodb must be a boolean');
            return true;
        },
        MongodbIp: function(val) {
            if (!checkIp(val)) return errorFn('MongodbIp must be a ip address, for example: 127.0.0.1');
            return true;
        },
        MongodbPort: function(val) {
            if (!isNumber(val)) return errorFn('MongodbPort must be a number, for example: 27017');
            return true;
        },
        MongodbConnectString: function(val) {
            if (val !== false && !isString(val)) return errorFn('MongodbConnectString must be false or connect string.');
            return true;
        },
        MongodbConnectTimeout: function(val) {
            if (!isNumber(val)) return errorFn('MongodbConnectTimeout must be a number, for example: 1000*30 = 30 minutes');
            return true;
        },
        MongodbMaxConnect: function(val) {
            if (!isNumber(val)) return errorFn('MongodbMaxConnect must be a number, for example: 50');
            return true;
        },
        MongodbDefaultDbName: function(val) {
            if (!isString(val)) return errorFn('MongodbDefaultDbName must be a string,  for example: rrest');
            return true;
        },
        MongodbRC: function(val) {
            if (!isString(val)&&!isBoolean(val)) return errorFn('MongodbRC must be a string or boolean,  for example: false or "Replic set name"');
            return true;
        },
        MongodbRChost: function(val) {
            if (!isArray(val)) return errorFn('MongodbRChost must be a array,  for example: false or ["10.1.10.30:10001","10.1.10.31:27017"]');
            return true;
        },
        poolLogger: function(val) {
            if (!isBoolean(val)) return errorFn('poolLogger must be a boolean');
            return true;
        },
    //AutoRequire
        AutoRequire: function(val) {
            if (!isBoolean(val)) return errorFn('AutoRequire must be a boolean');
            return true;
        },
        ModulesFloder: function(val) {
            if (!checkPath(val)) return errorFn('ModulesFloder must be a path, for example: /modules');
            return true;
        },
        ModulesExcept: function(val) {
            if (!isArray(val)) return errorFn("ModulesExcept must be a array, for example:['captcha']");
            return true;
        },
    //iptables
        IPfirewall: function(val) {
            if (!isBoolean(val)) return errorFn('IPfirewall must be a boolean');
            return true;
        },
        BlackList: function(val) {
            if (!isBoolean(val)) return errorFn('BlackList must be a boolean');
            return true;
        },
        ExceptIP: function(val) {
            if (!isRegExp(val)) return errorFn('ExceptIP must be a RegExp, for example: /^10.1.49.223$/');
            return true;
        },
        ExceptPath: function(val) {
            if (!isArray(val)) return errorFn("ExceptPath must be a array, for example:['/user']");
            return true;
        },
        NotAllow: function(val) {
            if (!isString(val)) return errorFn('NotAllow must be a string, for example: No permission!');
            return true;
        },
    //isClientPipe
        isClientPipe: function(val) {
            if (!isBoolean(val)) return errorFn('isClientPipe must be a boolean');
            return true;
        },
	};

function okFn(val) {
    //restlog.debug(val+'is ok!');
}
function warnFn(msg) {
    restlog.warn(msg);
    warn++;
    return false;
}
function errorFn(msg) {
    restlog.error(msg);
    errors++;
    return false;
}
function checkIp(val) {
	if (!(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(val))) return false
	return true;
}
function isString(val) {
	if (typeof val !== 'string') return false
	return true;
}
function isNumber(val) {
	if (typeof val !== 'number') return false
	return true;
}
function isArray(val) {
	return Array.isArray(val);
}
function isRegExp(val) {
	if (!(val instanceof RegExp)) return false
	return true;
}
function checkPath(val) {
	var val = val.toString()||'' + '';
	if (val.indexOf('/') === -1) return false;
	else if (val.indexOf('/') !== 0) return false;
	else if (val.lastIndexOf('/') === val.length-1) return false;
	return true;
}
function isBoolean(val) {
	if (typeof val !== 'boolean') return false;
	return true;
}
function inArray(val, array) {
	if (array.indexOf(val) === -1) return false;
	return true;
}
