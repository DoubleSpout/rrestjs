var http = require('http');
var cluster_plus = require('../lib/ClusterPlus');
var server = http.createServer(function (req, res) {
	res.end('we are listening on port:'+port);
});
var port = [3000, 3001, 3002, 3003, 3004, 3005];//待监听端口
var cp = cluster_plus({
		logger:true,
		num: 6,
		CreateCallback:function(err, data){
		if(err) console.log(err);
			else {
				console.log(data)
				server.listen(port[data.num])
			}
		},
		DeadCallback:function(err, data){
			if(err) console.log(err);
			else {
				console.log(data);
			}
		},
		RestartCallback:function(err, data){
			if(err) console.log(err);
			else {
				console.log(data);
			}
		}
	})

if(cp.isMaster){
	setInterval(function(){console.log(cp.workobj);
	},3000)
}
