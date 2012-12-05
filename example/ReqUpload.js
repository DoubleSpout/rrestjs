module.exports._rrestjsconfig = require('./config/post.conf.js');
var http = require('http'),
	util = require('util'),
	qs = require('qs'),
	rrest = require('../'),
    server = http.createServer(function (req, res) {
			var dd = qs.parse('a%5Bx%5D=1&a%5By%5D=2&b%5B%5D=1&b%5B%5D=2&b%5B%5D=3&b%5B%5D=4&c=3')
console.log(dd);
			if(req.method === 'POST'){
					res.write('<body>');
					res.write(formstr)
					res.write('<b>we get post data down list:</b><br /><br />');
					res.write('req.path:'+req.path+'<br />');
					res.write('req.ip:'+req.ip+'<br />');
					res.write('req.referer or req.referrer:'+req.referer+'<br />');
					res.write('req.useragent:'+req.useragent+'<br />');
					res.write('req.getparam:'+JSON.stringify(req.getparam)+'<br />');
					res.write('req.queryparam:'+JSON.stringify(req.queryparam)+'<br />');
					res.write('req.bodyparam:'+JSON.stringify(req.bodyparam)+'<br />');	
					res.write('req.deleteparam:'+JSON.stringify(req.deleteparam)+'<br />');
					res.write('req.postparam:'+JSON.stringify(req.postparam)+'<br />');
					res.write('req.putparam:'+JSON.stringify(req.putparam)+'<br />');
					res.write('req.cookie:'+JSON.stringify(req.cookie)+'<br />');
					res.write('<br/><br/><b>we got the multiform data down list:</b><br/><br/>')
					res.write(util.inspect(req.file));
					res.end('</body>');
			}
			else{
					res.write('<body>');
					res.write(formstr)
					res.write('<b>we get post data down list:</b><br /><br />');
					res.write('req.path:'+req.path+'<br />');
					res.write('req.ip:'+req.ip+'<br />');
					res.write('req.referer or req.referrer:'+req.referer+'<br />');
					res.write('req.useragent:'+req.useragent+'<br />');
					res.write('req.getparam:'+JSON.stringify(req.getparam)+'<br />');
					res.write('req.queryparam:'+JSON.stringify(req.queryparam)+'<br />');
					res.write('req.bodyparam:'+JSON.stringify(req.bodyparam)+'<br />');	
					res.write('req.deleteparam:'+JSON.stringify(req.deleteparam)+'<br />');
					res.write('req.postparam:'+JSON.stringify(req.postparam)+'<br />');
					res.write('req.putparam:'+JSON.stringify(req.putparam)+'<br />');
					res.write('req.cookie:'+JSON.stringify(req.cookie)+'<br />');
					res.end('</body>');
				
			}

	}).listen(rrest.config.listenPort);
var formstr = '<script src="http://www.6998cdn.com/skin/js/jquery.1.7.1.min.js"  type="text/javascript"></script>'+
			  '<form enctype="multipart/form-data" action="/user/name?method=post" method="post">'+
			  '<input type="text" name="input_name" value="spout" /><br/><br/>'+
			  '<input type="password" name="password" value="password" /><br/><br/>'+
			  '<input type="file" name="img" value="" /><br/><br/>'+
			  '<button type="submit">submit</button></form><br/><br/><br/><br/>';

var dd = qs.parse('a%5Bx%5D=1&a%5By%5D=2&b%5B%5D=1&b%5B%5D=2&b%5B%5D=3&b%5B%5D=4&c=3')
console.log(dd);	