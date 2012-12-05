module.exports.conf = require('./config/onesession.conf.js');
var http = require('http'),
	rrest = require('../'),
    server = http.createServer(function (req, res) {
		res.download(__dirname+'/static/evo.jpg', function(err){
			if(!err) console.log('success！！！');
		})
	}).listen(rrest.config.listenPort);