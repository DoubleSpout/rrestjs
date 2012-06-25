var http = require('http');
var server = http.createServer(function (req, res) {
	res.end('welcome to job1 worker');
}).listen(3000);
console.log('job1 is listen on port:'+3000);