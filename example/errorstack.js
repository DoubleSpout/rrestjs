module.exports.rrestjsconfig = require('./config/post.conf.js');
var http = require('http'),
	rrest = require('../'),
    server = http.createServer(function (req, res) {
		try{
			require('./z')
		}
		catch(e){
			restlog.error(e)
		}
	}).listen(rrest.config.listenPort);
