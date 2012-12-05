module.exports.rrestjsconfig = require('./config/post.conf.js');
var http = require('http'),
	rrest = require('../'),
    server = http.createServer(function (req, res) {
		res.sendfile(__dirname+'/static/evo.jpg', function(err){
			if(!err) console.log('success！！！');
		})
	}).listen(rrest.config.listenPort);