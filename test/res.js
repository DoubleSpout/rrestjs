/*
	基本测试，response 例子
*/
var should = require('should');
var fs = require('fs');
var path = require('path');
var testconf = require('./testconf.js');
module.exports.rrestjsconfig = {
	listenPort:3000,
	tempSet:'ejs',
	tempFolder :'/static',
	baseDir: path.join(__dirname),
};

var imgbuf = fs.readFileSync(path.join(__dirname,'static','octocat.png'))

var http = require('http'),
	rrest = require('../'),
    server = http.createServer(function (req, res){
		if(req.path[0] == 'cache'){
			res.cache('public',1000*60*60*24);
			res.cookie('userid', '123456', {maxAge:1000*60*60, httpOnly:false});
			res.sendjson({body:'hello wrold'});
		}
		if(req.path[0] == 'r404'){
			res.r404('/static/404.html');

		}
		if(req.path[0] == 'redirect'){
			res.redirect('/login', 301);
		}
		if(req.path[0] == 'sendfile'){
            res.cache('public',-2);
            should.strictEqual(res._nocache, true);
			res.file('/static/favicon.ico');
		}
        if(req.path[0] == 'sendfile2'){
            res.cache(false);
            should.strictEqual(res._nocache, true);
			res.file('/static/404.html');
		}

        if(req.path[0] == 'sendfile3'){
            res.cache('public',-2);
            should.strictEqual(res._nocache, true);
			res.file('/static/404.html');
		}

                    res.cache(false);
            should.strictEqual(res._nocache, true);


		if(req.path[0] == 'download'){
			res.download(__dirname+'/static/favicon.ico');
		}
		if(req.path[0] == 'render'){
			res.render('/ejs.ejs', {name:'rrestjs'});
		}
		if(req.path[0] == 'sendjsonp'){
			res.sendjsonp({content:'jsonp'})
		}
		if(req.path[0] == 'clearcookie'){
			res.clearcookie('userid');
			res.send('');
		}
		if(req.path[0] == 'r500'){
            res.cache('public',-1);
            should.strictEqual(res._nocache, true);
			res.r500();
		}
		if(req.path[0] == 'r403'){
			res.r403();
		}

		if(req.path[0] == 'img'){
			
			res.setHeader('content-type', 'image/jpeg')
			res.send(imgbuf);
		}
	}).listen(rrest.config.listenPort);

//设置全局的模版option
rrest.tploption.userid = function(req,res){return req.ip};
rrest.tploption.name = 'rrestjs default';
rrest.tploption.usersex = 'male';

http.globalAgent.maxSockets = 13;

var file = require('fs');
var i = 13;
var r = 0
var result = function(name){
	var num = ++r;
	console.log('%s test done, receive %d/%d', name, num, i);
	if(num>=i){
		console.log('response.js test done.')
		process.exit();
	}
}

var getfn = function(path, cb){
	var request  = 	http.request({
			host:testconf.hostname,
			port:3000,
			path:'/'+path,
			method:'GET',
			headers:{'Accept':'text/html',
					 'Content-Type':'application/x-www-form-urlencoded', 
					 'Content-Length':'19',
					 'User-Agent':'node.js-v0.8.8', 
					 'cookie':'userid=123456; mycookie2=abcdefg', 
					 'X-Requested-With':'xmlhttprequest',
					 'Connection':'keep-alive',
					 'Referer':'http://www.cnodejs.org/'}
		}, function(res){
				var body = '';
				res.on('data', function(chunk) {
						// convert chunk to utf8 text:
						 body += chunk;
						// process utf8 text chunk
					});
				res.on('end', function() {
						cb(res, body);
					});
		}).on('err', function(e){
			throw e;
		});
		request.end();
}

getfn('cache', function(res, body){
		should.strictEqual(res.statusCode, 200);
		should.strictEqual(res.headers['cache-control'], 'public, max-age='+60*60*24);
		should.strictEqual(res.headers['set-cookie'].toString(), [ 'userid=123456; path=/; expires='+new Date(Date.now() + 1000*60*60).toUTCString()].toString());
		should.strictEqual(body, JSON.stringify({body:'hello wrold'}));
		result('cache');
});

getfn('r404', function(res, body){
	should.strictEqual(res.statusCode, 404);
	should.strictEqual(body, '404 not found');
	result('r404');
});

getfn('redirect', function(res, body){
	should.strictEqual(res.statusCode, 301);
	should.strictEqual(res.headers.location, '/login');
	result('redirect');
});

getfn('sendfile', function(res, body){
	var fav = file.readFileSync(__dirname+'/static/favicon.ico', 'utf-8');
	should.strictEqual(res.statusCode, 200);
    should.strictEqual(res.headers['cache-control'], 'public, max-age=-1');
	should.strictEqual(body, fav);
	result('sendfile');
});

getfn('sendfile2', function(res, body){

	should.strictEqual(res.statusCode, 200);

	result('sendfile');
});


getfn('sendfile3', function(res, body){

	should.strictEqual(res.statusCode, 200);
    should.strictEqual(res.headers['cache-control'], 'public, max-age=-1');

	result('sendfile');
});


getfn('download', function(res, body){
	var fav = file.readFileSync(__dirname+'/static/favicon.ico', 'utf-8');
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(res.headers['content-disposition'], 'attachment; filename="favicon.ico"');	
	should.strictEqual(body, fav);
	result('download');
});


getfn('render', function(res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(body, '<li>rrestjs</li><li>'+testconf.hostname+'</li><li>male</li><form></form>');
	result('render');
});

getfn('sendjsonp?callback=cb', function(res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(res.headers['content-type'], 'text/javascript')
	should.strictEqual(body, 'cb({"content":"jsonp"});');
	result('sendjsonp');
});
	
getfn('clearcookie', function(res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(res.headers['set-cookie'].toString(), [ 'userid=; path=/; expires='+new Date(1).toUTCString()+'; httpOnly'].toString());
	result('clearcookie');
});

getfn('r403', function(res, body){
	should.strictEqual(res.statusCode, 403);
	result('403 error');});

getfn('r500', function(res, body){
	should.strictEqual(res.statusCode, 500);
	result('500 error');
});

getfn('img', function(res, body){
	var imgbuf2 = fs.readFileSync(path.join(__dirname,'static','octocat.png'),'utf-8')
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(res.headers['content-type'], 'image/jpeg')
	should.strictEqual(body, imgbuf2);
	result('500 error');
});






