/*
	基本测试，hello world例子
*/

var should = require('should');
var path = require('path');
var fs = require('fs');
var testconf = require('./testconf.js');

module.exports.rrestjsconfig = {
	listenPort:3000,
	baseDir: path.join(__dirname),
	postLimit:1024*1024*100,//限制上传的postbody大小，单位byte
	connectTimeout:1000*5,//限制客户端连接的时间，false为永远不超时，1000表示客户端和服务端1秒内没活跃则自动切断客户端连接

	};

var http = require('http'),
	rrest = require('../'),
    server = http.createServer(function (req, res){
		
		//console.log(req.api);


		if(req.pathname === '/json1'){
			should.strictEqual(req.apibody.a, 1);
			should.strictEqual(req.apibody.bbb, 222);
			should.strictEqual(req.apibody.ccc, 333);
            should.strictEqual(req.param.xx, '11');
            should.strictEqual(req.param.aa, '22');
		}

		if(req.pathname === '/json2'){
			should.strictEqual(req.apibody.author.name, "doublespout");
			should.strictEqual(req.apibody.url, "http://www.rrestjs.com");
			should.strictEqual(req.apibody.keywords[3], "nodejs framework");
		}

        if(req.pathname === '/xml1'){
			should.strictEqual(req.apibody.CATALOG.PLANT[0].COMMON[0], 'Bloodroot');
			should.strictEqual(req.apibody.CATALOG.PLANT[req.apibody.CATALOG.PLANT.length-1].AVAILABILITY[0], '022299');
			should.strictEqual(req.apibody.CATALOG.PLANT[1].ZONE[0], '3');
            should.strictEqual(req.param.aa, '11');
            should.strictEqual(req.param.bb, '22');
		}




		

		res.api({status:200,data:'hello wrold'});

	}).listen(rrest.config.listenPort);


http.globalAgent.maxSockets = 20;


setTimeout(function(){

var i = 9;
var r = 0;
var result = function(name){
	var num = ++r;
	console.log('%s test done, receive %d/%d', name, num, i);
	if(num>=i){
		console.log('apiPostServer.js test done.')
		process.exit();
	}
}


var postfn = function(accept, type, str, path, cb, len){
	var request  = 	http.request({
			host:testconf.hostname,
			port:3000,
			path:'/'+path,
			method:'POST',
			headers:{
				'accept':accept || 'application/json',
				'content-type':type || 'application/json',
				'content-length':len || Buffer.byteLength(str)
			}
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
		request.end(str);
}


var xmlstr =  fs.readFileSync(path.join(__dirname,'xml','xml.xml'),'utf-8');
var xmlhead = 'application/xml; charset=utf-8';
var xmlrec =  '<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<rrestApiXml><status>200</status><data>hello wrold</data></rrestApiXml>'
var jsonstr = fs.readFileSync(path.join(__dirname,'..','package.json'),'utf-8');


postfn(null, null, '{"a":1,"bbb":222,"ccc":333}','/json1?xx=11&aa=22',function(res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(res.headers['content-type'], 'application/json; charset=utf-8');
	should.strictEqual(body, '{"status":200,"data":"hello wrold"}');
	result('json in json out');
})



postfn(null, null, '{"a":1,"bbb":222,"ccc":\'333\'}','/json2',function(res, body){
	should.strictEqual(res.statusCode, 400);
	result('not json');
})






postfn(null, null, jsonstr,'/json2',function(res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(res.headers['content-type'], 'application/json; charset=utf-8');
	should.strictEqual(body, '{"status":200,"data":"hello wrold"}');
	result('big json');
})



postfn(null, null, jsonstr,'/json5',function(res, body){
	should.strictEqual(res.statusCode, 400);
	result('too big content- length');
},1024*1024*1024)


/*
postfn(null, null, jsonstr,'/json5',function(res, body){
	should.strictEqual(res.statusCode, 400);
    console.log(body)
	result('content-length not correct');
},1024)
*/


    postfn(xmlhead, null, '{"a":1,"bbb":222,"ccc":333}','/json1?xx=11&aa=22',function(res, body){
        should.strictEqual(res.statusCode, 200);
        should.strictEqual(res.headers['content-type'], 'application/xml; charset=utf-8');
        should.strictEqual(body, xmlrec);
        result('json in xml out');
    })



postfn(xmlhead, xmlhead, xmlstr, '/xml1?aa=11&bb=22',function(res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(res.headers['content-type'], 'application/xml; charset=utf-8');
	should.strictEqual(body,xmlrec);
	result('xml in xml out');
})

postfn(null, xmlhead, xmlstr, '/xml2',function(res, body){
	should.strictEqual(res.statusCode, 200);
	should.strictEqual(res.headers['content-type'], 'application/json; charset=utf-8');
	should.strictEqual(body, '{"status":200,"data":"hello wrold"}');
	result('xml in json out');
})

postfn(xmlhead, xmlhead, xmlstr+'/fsdfsdf', '/xml1?aa=11&bb=22',function(res, body){
    should.strictEqual(res.statusCode, 400);
	result('xml not correct');
})

postfn('text/html', 'apple', jsonstr, '/xml1?aa=11&bb=22',function(res, body){
    should.strictEqual(res.statusCode, 400);

	result('head error');
})

   

},1000*3);