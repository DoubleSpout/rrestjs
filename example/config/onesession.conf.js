var path = require('path');
module.exports = {
//通用配置
/*
* 注意，所有的路径配置的前面请加‘/’而后面不要加'/'！
*/
	listenPort:3000,//监听端口，如果配合clusterplus监听多个端口，这里也可以使用[3000, 3001, 3002, 3003]数组形式，rrestjs会智能分析
	baseDir: path.join(__dirname, '/../..'), //绝对目录地址，下面的目录配置都是根据这个目录的相对地址，这里是根据config文件进行配置地址
	staticFolder:'/example/static',
//session配置
	isSession:true, //是否开启session，开启会影响性能。
	syncSession:false,//当多进程时是否开启session同步，开启会影响性能。
	sessionName:'rrSid', //保存session id 的cookie 的name
	sessionExpire:false, //false表示会话session，否则填入1000*60，表示session有效1分钟
	clearSessionSetInteval:1000*60*60, //自动清理垃圾session时间，建设设置为1小时
	clearSessionTime:1000*60*60*24,//会话session超时，建议设置为1天
}