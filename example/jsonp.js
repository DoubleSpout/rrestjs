module.exports.conf = require('./config/onesession.conf.js');
var http = require('http'),
	rrest = require('../'),
    server = http.createServer(function (req, res) {
			var cb = req.getparam.callback;
			if(!cb) res.send(htmlstr);
			else res.sendjsonp({name:'snoopy', age:'27'});
	}).listen(rrest.config.listenPort);
var htmlstr = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'+
			  '<html xmlns="http://www.w3.org/1999/xhtml">'+
			  '<head>'+
			  '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'+
			  '<title>jsonp</title>'+
			  '<script>function jsonpback(obj){alert(obj.name);alert(obj.age);}</script>'+
			  '</head><body>'+
			  '一个jsonp的例子'+
			  '<script src="/?callback=jsonpback"></script></body></html>'