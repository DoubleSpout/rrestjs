var path = require('path'),
	processPath = path.dirname(process.argv[1]);//运行node的目录，这里可以方便替换下面baseDir的__dirname,方便用户自己搭建目录，利用node_modules加载rrestjs
module.exports = {
//通用配置
/*
* 注意，所有的路径配置的前面请加‘/’而后面不要加'/'！
*/
	listenPort:3000,//监听端口，如果配合clusterplus监听多个端口，这里也可以使用[3000, 3001, 3002, 3003]数组形式，rrestjs会智能分析
	baseDir: path.join(__dirname, '/../..'), //绝对目录地址，下面的目录配置都是根据这个目录的相对地址，这里是根据config文件进行配置地址
//mongodb 配置
	isMongodb:true, //是否开启mongodb支持，注意：如果使用数据库存储session，这里必须开启
	MongodbIp:'10.1.10.30', //mongodb地址
	MongodbPort:10001, //mongodb端口
	MongodbConnectString:false, //是否使用字符串连接，日入nae的连接方法，这个优先级高于地址+端口
	MongodbConnectTimeout:1000*30,//连接超时
	MongodbMaxConnect:50,//连接池连接数
	MongodbDefaultDbName:'rrest',//默认使用的数据库名
	poolLogger:false,//是否记录连接池的日志，建议关闭
	MongodbRC:false,//如果是false表示不使用mongodb的副本集，否则为字符串，表示副本集的名称
	MongodbRChost:[],//表示mongodb副本集的ip:port数组。
}