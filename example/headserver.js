module.exports.conf = require('./config/onesession.conf.js');
var http = require('http'),
	rrest = require('../'),
	RestUtils = require('../lib/RestUtils'),
    server = http.createServer(function (req, res){
		//RestUtils.forbidden(res, '不允许');
		//res.sendfile(__dirname+'/headserver.js');
		res.send('head method can not see this');
		/*  res.write('req.getparam:'+JSON.stringify(req.getparam)+'<br />');
		  res.write('req.deleteparam:'+JSON.stringify(req.deleteparam)+'<br />');
		  res.write('req.postparam:'+JSON.stringify(req.postparam)+'<br />');
		  res.write('req.putparam:'+JSON.stringify(req.putparam)+'<br />');
		  res.end()*/
	}).listen(rrest.config.listenPort);
