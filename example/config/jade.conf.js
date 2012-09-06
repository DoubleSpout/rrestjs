var path = require('path');
module.exports = {
//通用配置
/*
* 注意，所有的路径配置的前面请加‘/’而后面不要加'/'！
*/
	server:'rrestjs',     
	poweredBy: 'node.js',
	listenPort:3000,//监听端口，如果配合clusterplus监听多个端口，这里也可以使用[3000, 3001, 3002, 3003]数组形式，rrestjs会智能分析
	baseDir: path.join(__dirname, '/../..'), //绝对目录地址，下面的目录配置都是根据这个目录的相对地址，这里是根据config文件进行配置地址
	isSession:true, //是否开启session，开启会影响性能。
//Template
	tempSet:'jade', //使用哪种页面模版：jade或者ejs
	tempFolder :'/example/static', //默认读取模版的根目录
	tempHtmlCache:true, //是否开启模版的html缓存，当输出模版需要大量数据库或缓存I/O操作，且实时性要求不高时可以使用
	tempCacheTime:1000*60*60,//模版缓存时间
	tempCacheFolder:'/tmp/template', //模版缓存 存放目录
}