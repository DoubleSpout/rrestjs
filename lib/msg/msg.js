//rrestjs的提示语配置
var resmsg = {
	notFound:'Sorry, resources not found!',
	lessError:'Less render error!',
	lessWriteError:'Write less file error!',
	parseNotExist:'Some of them is not existed!',
	parseCreateCacheError:'Create CacheParse file error!',
	parseTypeError :'Only support parse css or js!',
	parseError:'Can not parse these files, some of them has wrong url or is not css|js files!',
	parseTooLong:'Can not parse too many files!',
	ejsRenderError:'ejs render error!',
	jadeRenderError:'jade render error!',
	uploadError:'Sorry! Upload file error!',
	postputError:'Sorry! Post or Put error!',
	faviconError:'Response favicon.ico error!',
	postError1:'Post or Put method must have a content-length http header!',
	postError2:'Too big post or put body!',
	postError3:'Post or Put method must have a content-type http header!',
	resJsonpError:'To use rrestjs jsonp need param "callback".',
	templateSetError:'template set error',
	getOnlyError:'Sorry this source get method only',
};
var tipsmsg = {
	resRedirect:'Redirecting to ',
};
var errmsg = {
	notFoundDir:'Coudle not found dir:',
	notRequire:'Coudle not require module:',
	parseCacheNotFound:'Read cache staticParse file error, path: ',
	createFolderError:'Create folder fail, error path: ',
	dbConnectError:'Mongodb connect faild:',
	dbConfigError:'Use mongodb must let the config.isMongodb open.',
	dbReplicSetError:'To use mongodb ReplicSet must set the config.MongodbRChost like this ["10.1.10.30:27017","10.1.10.31:10001"]',
	uploadError:'Upload file error.',
	clusterDirError:'Not found ClusterReload folder, create it or change the config.js!defaul will be baseDir!',
	sessionNoneError:'Not found session, we have not any session!',
	resFilepathError:'Not have filepath!',
	staticSendError:'Could not send a directory!',
	sessionDbIdError:'Invalid session id!',
	sessionDbProcessError:'SessionMongodb must start mongodb process first!',
	sessionDbCommonError:'Session mongodb error.',
	templateWriteCacheError:'Write template_cache error: ',
	addpipeError:'The addpipe name has already exist! addpipe name is: ',
	defineRouter:'Repeat define routes',
	genCache:'Cache generating please wait',
	resapiError:'Response api error',
	serverTimeout:'server socket time out',
	};
var msg =   module.exports = {
	resmsg:resmsg,//响应客户端的错误
	tipsmsg:tipsmsg,//提示信息
	errmsg:errmsg,//错误日志错误
	parse:function(msg, error){//拼装错误提示
		var error = error || '';
		if('object' === typeof error) error = JSON.stringify(error);
		return msg+'; error:'+error;
	}
}
