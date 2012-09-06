module.exports.config = require('./config/autoReuqire.conf.js');
var http = require('http'),
	rrest = require('../'), 
	i=0;

 var   server = http.createServer(rrest(function (req, res) {
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
	})).listen(rrest.config.listenPort);
	rrest.tploption.names = ['123', '456', '789']