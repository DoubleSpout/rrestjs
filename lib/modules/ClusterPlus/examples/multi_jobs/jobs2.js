var http = require('http');
var server = http.createServer(function (req, res) {
	res.end('welcome to job2 worker');
}).listen(3001);
console.log('job2 is listen on port:'+3001);