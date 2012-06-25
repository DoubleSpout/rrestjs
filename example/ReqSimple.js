module.exports.rrestjsconfig = require('./config/post.conf.js');
var http = require('http'),
	rrest = require('../'),
    server = http.createServer(rrest(function (req, res){
		res.write('<body>');
		res.write('req.path:'+req.path+'<br />');
		res.write('req.ip:'+req.ip+'<br />');
		res.write('req.referer or req.referrer:'+req.referer+'<br />');
		res.write('req.useragent:'+req.useragent+'<br />');
		res.write('req.getparam:'+JSON.stringify(req.getparam)+'<br />');
		res.write('req.deleteparam:'+JSON.stringify(req.deleteparam)+'<br />');
		res.write('req.postparam:'+JSON.stringify(req.postparam)+'<br />');	
		res.write('req.putparam:'+JSON.stringify(req.putparam)+'<br />');	
		res.write('req.cookie:'+JSON.stringify(req.cookie)+'<br />');
		res.write('<script>document.cookie = "name = spout"</script>');
		res.end('</body>');
	})).listen(rrest.config.listenPort);