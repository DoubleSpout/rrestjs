var http = require('http'),
    port = 3000,
    ClusterPlus = require('../lib/ClusterPlus'),
    server = http.createServer(function (req, res) {
		res.end('this is a fdsfds, devleper!');
	}),
    cp = ClusterPlus({logger:true});
if(cp.isWorker){
	server.listen(port);//listen
	console.log('server listen at port '+port);
}
if(cp.isMaster){
	setInterval(function(){console.log(cp.workobj);
	},3000)
}
//这是个简单的例子
//将创建cpu个子进程来监听3000端口。
//支持自动reload，比如您可以试试将3000端口改成3001。
//不用重新启动node.js进程就可以改为监听3001端口
//您可以试着此句：
//console.log('server listen at port '+port)
//改为：
//console.log('server listen at port 'port)
//然后点击ctrl+s保存，这样程序就会报错，无法访问3000端口
//您不必重启，只需将代码改回：
//console.log('server listen at port '+port)
//服务又重新启动了，又可以正常访问3000端口了
//然后您可以尝试修改：thank you! this is a simple example!
//改为：HO~it is modify!
//更多例子请参考expamle文件夹




