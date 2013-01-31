module.exports.rrestjsconfig = require('./config/post.conf.js');
var http = require('http'),
	rrest = require('../'),
    server = http.createServer(function (req, res) {
        if(req.method === 'POST'){
            if(req.apibody){
                 res.api(req.apibody);
            }
           else{
                res.sendjson(req.param)
            }
        }

	}).listen(rrest.config.listenPort);
console.log('please request use dev http')