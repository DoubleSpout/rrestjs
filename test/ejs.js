var path = require('path');
var should = require('should');
module.exports._conf ={
	listenPort:3000,
	baseDir: path.join(__dirname), //绝对目录地址，下面的目录配置都是根据这个目录的相对地址，这里是根据config文件进行配置地址
//Template
	tempSet:'jade',
	tempFolder :'/example/static', 
	tempHtmlCache:false, 
}

var http = require('http'),
	rrest = require('../'), 
	i=0,
    server = http.createServer(rrest(function (req, res) {
		var n = (i++)%8;
		if(n===0){
			res.render('/index2.jade');
		}
		else if(n===1){
			res.render('/index.jade', {"t":'hello world'});
		}
		else if(n===2){
			res.render('/index2.jade',function(err, html){
				console.log(err);
				console.log(html);
			});
		}
		else if(n===3){
			res.render('/index.jade', {"t":'hello world'}, function(err, html){
				console.log(err);
				console.log(html);
			});
		}
		else if(n===4){
			res.render('/index.jade', i, {"t":'hello world'});
		}
		else if(n===5){
			res.render('/index.jade', i, {"t":'hello world'}, function(err, html){
				console.log(err);
				console.log(html);
			});
		}
		else if(n===6){
			res.compiletemp('/index2.jade', function(err, html){
				res.sendjson({'data':html});
			});
		}
		else if(n===7){
			res.compiletemp('/index.jade', i, {"t":'hello world'}, function(err, html){
				res.sendjson({'data':html});
			});
		}
	})).listen(rrest.config.listenPort);
