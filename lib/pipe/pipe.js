var clientpipe = require('../RestPipe.js'),
	baseDir = _restConfig.baseDir;

/*下面是默认提供的一些方法，方便测试和开发者使用*/
/*
第一个是 get 方法，异步
不多介绍了
*/

clientpipe.addasy('get', function(url, asyback){
		var http=require('http');
			http.get(url, function(res){
				var body = '';
				res.on('data', function (chunk) {
					 body += chunk;
				 });
				 res.on('end', function(){
					asyback(null, {headers:res.headers, statusCode:res.statusCode, data:body});
				 });
			}).on('error', function(e) {
				asyback('get request error');
		});
});
/*
第二个是 request 方法，异步
options 同node.js的api
options.data参数表示用户期望发送的数据
options.encoding，默认是utf-8
*/
clientpipe.addasy('request', function(options, asyback){
		var http = require('http'),
			querystring = require('querystring');
		http.request(options, function(res){
				var body = '';
				res.setEncoding(options.encoding||'utf-8');
				res.on('data', function (chunk) {
					 body += chunk;
				 });
				 res.on('end', function(){
					asyback(null, {headers:res.headers, statusCode:res.statusCode, data:body});
				 });
			}).on('error', function(e) {
				asyback('request error');
			}).end(querystring.stringify(options.data||{}));
});
/*
第三个是MD5方法
*/

clientpipe.addsyn('md5', function(str){
	var crypto = require('crypto');
	var shasum = crypto.createHash('md5');
	shasum.update(str);
	return shasum.digest('hex');
});

/*
第四个是sha1方法
*/
clientpipe.addsyn('sha1', function(str){
	var crypto = require('crypto');
	var shasum = crypto.createHash('sha1');
	shasum.update(str);
	return shasum.digest('hex');
});
/*
第5个是readfile方法
*/
clientpipe.addasy('readfile', function(filepath, asyback){
		var fs = require('fs'),
			path = require('path');
		fs.readFile(baseDir+path.normalize(filepath), 'utf-8', function(err,data){
			if(err) asyback('read file fail!')
			else asyback(null, data);
		});
});
/*
第6个是 url.parse 方法
*/
clientpipe.addsyn('urlparse', function(pathurl){
	var url = require('url');
	return url.parse(pathurl);
});
/*
第7个是 memory 方法
*/
clientpipe.addsyn('memory', function(){
	return process.memoryUsage();
});