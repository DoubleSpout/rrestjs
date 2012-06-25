var http = require('http');
var server = http.createServer(function (req, res) {
	res.end('welcome to job4 worker');
}).listen(3003);
console.log('job4 is listen on port:'+3003);