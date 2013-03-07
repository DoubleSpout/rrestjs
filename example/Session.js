module.exports._appconfig = require('./config/onesession.conf.js');
var http = require('http'),
	rrest = require('../'),
    server = http.createServer(function (req, res) {
				var session = req.session;
					if(!session.count){
						session.count = 0;
					}	
					if(session.count>10){
						req.delsession();
						res.send('session 到 11 了，被删除！');
						return;
					}
				 res.send(++session.count);
	}).listen(rrest.config.listenPort);
	
	setInterval(function(){
		console.log(process.pid + ' : '+JSON.stringify(rrest._restSession));
	},3000)
