module.exports._rrestjsconfig = require('./config/syncsession.conf.js');
var http = require('http'),
	rrest = require('../'),
	server = http.createServer(function (req, res){
			var session = req.session;
			if(session.count>10){
				req.delsession();
				res.send('process '+rrest.id+' (process.pid : '+process.pid+' ) is working: session count 11 has deleted!');
				return
			}
			if(!session.count){
				session.count = 0;
			}					
			res.send('process '+rrest.id+' (process.pid : '+process.pid+' ) is working: session.count'+(++session.count));
	}).listen(rrest.config.listenPort);		

