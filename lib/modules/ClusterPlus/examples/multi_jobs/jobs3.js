var http = require('http');
var server = http.createServer(function (req, res) {
	res.end('welcome to job3 worker');
}).listen(3002);
console.log('job3 is listen on port:'+3002);