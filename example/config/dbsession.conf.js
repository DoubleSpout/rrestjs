var path = require('path');
module.exports = {
	listenPort:3000,//监听端口，如果配合clusterplus监听多个端口，这里也可以使用[3000, 3001, 3002, 3003]数组形式，rrestjs会智能分析
	baseDir: path.join(__dirname, '/../..'), //绝对目录地址，下面的目录配置都是根据这个目录的相对地址，这里是根据config文件进行配置地址
//cluster配置
	isCluster:true, //是否开启多进程集群
	isClusterAdmin:false,//进程监听管理功能是否开启
	CLusterLog:false,//是否打开cluster自带的控制台信息，生产环境建议关闭
	adminListenPort:20910,//管理员监听端口号
	adminAuthorIp:/^10.1.49.223$/,//允许访问管理的IP地址
	ClusterNum:8, //开启的进程数
	ClusterReload:'/example',//只有当进程数为1时，进入开发模式，可以监听此文件夹下的改动，包括子文件夹，不用重复 ctrl+c 和 上键+enter		
//mongodb 配置
	isMongodb:true, //是否开启mongodb支持，注意：如果使用数据库存储session，这里必须开启
	MongodbIp:'127.0.0.1', //mongodb地址
	MongodbRC:false,//如果是false表示不使用mongodb的副本集，否则为字符串，表示副本集的名称
	MongodbRChost:[],//表示mongodb副本集的ip:port数组。
	MongodbPort:27017, //mongodb端口
	MongodbConnectString:false, //是否使用字符串连接，日入nae的连接方法，这个优先级高于地址+端口
	MongodbConnectTimeout:1000*30,//连接超时
	MongodbMaxConnect:50,//连接池连接数
	MongodbDefaultDbName:'rrest',//默认使用的数据库名
	poolLogger:false,//是否记录连接池的日志，建议关闭

//session配置
	isSession:true, //是否开启session，开启会影响性能。
	syncSession:false,//当多进程时是否开启session同步，开启会影响性能。
	sessionName:'rrSid', //保存session id 的cookie 的name
	sessionExpire:false, //false表示会话session，否则填入1000*60，表示session有效1分钟
	clearSessionSetInteval:1000*60*3, //自动清理垃圾session时间，建设设置为1小时
	clearSessionTime:1000*60*60*24,//会话session超时，建议设置为1天
//session内存存储
	sessionDbStore:true,//是否使用mongodb数据库存储session，如果设置为true，则不需要同步session
}