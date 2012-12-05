module.exports._conf = require('./config/jade.nocache.conf.js');
var http = require('http'),
	rrest = require('../'), 
	i=0,
    server = http.createServer(function (req, res) {
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
	}).listen(rrest.config.listenPort);
