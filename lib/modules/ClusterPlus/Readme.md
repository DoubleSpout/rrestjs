# ClusterPlus——node.js多任务子进程管理模块  

##simple example:

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


##这是个简单的例子，

将创建cpu个子进程来监听3000端口。

支持自动reload，比如您可以试试将3000端口改成3001。

不用重新启动node.js进程就可以改为监听3001端口

您可以试着此句：

console.log('server listen at port '+port)

改为：

console.log('server listen at port 'port)

然后点击ctrl+s保存，这样程序就会报错，无法访问3000端口

您不必重启，只需将代码改回：

console.log('server listen at port '+port)

服务又重新启动了，又可以正常访问3000端口了

您还可以修改 this is a fdsfds, devleper! 改成其他任意的东西

您再访问看看3000端口，发现其改变了




## ClusterPlus
      
 ClusterPlus是一个基于 node.js v0.6.5 的cluster加强模块，主要提供如下功能：
 
 1、可以多开子进程，并且可以在建立子进程时监听不同的端口，或者做其他事情，详情参阅example

 2、当子进程意外死亡时，主进程会自动唤醒，并且还是监听之前的端口，或做之前的事情

 3、加入reload.js模块，当子进程为一个时，自动打开relaod功能，当监听目录有文件变更时，自动重启子进程，目前多子进程支持此功能不稳定

 4、可以通过实例化的ClusterPlus对象，在master进程中，ClusterPlus.workobj 数组，按顺序存放素有子进程的pid

 5、ClusterPlus.restart()方法，可以传入pid对单个子进程进行重启，如果不传入则视为全部子进程重启
  

## Installation

    download it!

## API

setting example:{

	logger:Boolean || function(str){},//布尔值，用来表示是否打开日志,或者是function，用来记录日志的方法,参数是str输出字符串

	num:Integer, //整数，启动几个子进程

	CreateCallback:function(err, childobj){}, //函数，当创建完成后执行，返回的参数是num整形表示第几个child，和进程ID

	DeadCallback:function(err, childobj){},//函数，当子进程死掉时执行，返回的参数是num整形表示第几个child，和进程ID

	RestartCallback:function(err, childobj){},//函数，当子进程重启时执行，返回的参数是num整形表示第几个child，和进程ID

	reload:Boolean,string //布尔值或字符串，当为true时默认启动目录，或者为文件目录。

	*注意：reload只有在启动一个子进程的情况下才工作良好，并且reload会遍历监听设定目录下的所有目录，请妥善设定监听目录，默认是启动目录

	*childobj = {num:num, pid:pid}

	}

或者直接传入 setting = Integer,表示启动多个node.js

或者不传参数，表示启动1个子进程进入，reload模式开启

ClusterPlus = require('ClusterPlus')();

返回ClusterPlus实例，master中将有：

1、ClusterPlus.workobj 数组，按顺序存放素有子进程的pid

2、ClusterPlus.restart()方法，可以传入pid，如果不传入则视为全部子进程重启