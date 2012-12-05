module.exports.conf = require('./config/autoReuqire.conf.js');
var http = require('http'),
	rrest = require('../'),
    server = http.createServer(function (req, res) {
		res.send(htmlstr);
	}).listen(rrest.config.listenPort);
var htmlstr = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'+
			  '<html xmlns="http://www.w3.org/1999/xhtml">'+
			  '<head>'+
			  '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'+
			  '<script src="/static/js.js" type="text/javascript"></script>'+
			  '<script src="/static/js/js1/a.js" type="text/javascript"></script>'+
			  '<link href="/static/base.css" type="text/css" rel="stylesheet" />'+
			  '<link href="/static/base.less" type="text/css" rel="stylesheet" />'+
			  '<title>jsonp</title>'+
			  '</head><body>'+
			  '一个自动输出静态文件的例子'+
			  '<img src="/static/evo.jpg"/>'+
			  '<div id="header">我是less设置的文字颜色</div>'+
			  '<h2>我是less设置的文字颜色</h2>'+
			  '<div id="div"></div>'+
			  '<script src="/static/base.js" type="text/javascript"></script>'
			  '</body></html>'