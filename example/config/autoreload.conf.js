var path = require('path');
module.exports = {
	listenPort:3000,//监听端口，如果配合clusterplus监听多个端口，这里也可以使用[3000, 3001, 3002, 3003]数组形式，rrestjs会智能分析
	baseDir: path.join(__dirname, '/../..'), //绝对目录地址，下面的目录配置都是根据这个目录的相对地址，这里是根据config文件进行配置地址
//cluster配置
	isCluster:true, //是否开启多进程集群
	isClusterAdmin:true,//进程监听管理功能是否开启
	adminAuthorIp:/^192.168.10.87$/,//允许访问管理的IP地址
	ClusterNum:1, //开启的进程数
	ClusterReload:'/example',//只有当进程数为1时，进入开发模式，可以监听此文件夹下的改动，包括子文件夹，不用重复 ctrl+c 和 上键+enter		
}