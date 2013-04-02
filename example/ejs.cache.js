module.exports.config = require('./config/ejs.cache.conf.js');
var http = require('http'),
	rrest = require('../'), 
	i=0;

 var   server = http.createServer(function (req, res) {
		var n = (i++)%2;
		if(n===0){
			res.compiletemp('/index.ejs', {names:['foo', 'bar', 'baz']}, function(err, data){
					res.sendjson({'html':data});
			});
		}
		else{
			res.render('/index.ejs', function(err, html){
				console.log(err);
				console.log(html);
			});
		}
	}).listen(rrest.config.listenPort);
	rrest.tploption.names = function(req, res){
					return [JSON.stringify(req.headers), '456', '789']
	}