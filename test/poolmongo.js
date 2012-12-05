var path = require('path');
var testconf = require('./testconf.js');
var request = require('request');
var should = require('should');
module.exports.rrestconfig  = {
	listenPort:3000,//监听端口，如果配合clusterplus监听多个端口，这里也可以使用[3000, 3001, 3002, 3003]数组形式，rrestjs会智能分析
	baseDir: path.join(__dirname, '/../..'), //绝对目录地址，下面的目录配置都是根据这个目录的相对地址，这里是根据config文件进行配置地址
		
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
	clearSessionSetInteval:1000*60*60, //自动清理垃圾session时间，建设设置为1小时
	clearSessionTime:1000*60*60*24,//会话session超时，建议设置为1天
//session内存存储
	sessionDbStore:true,//是否使用mongodb数据库存储session，如果设置为true，则不需要同步session
}



var http = require('http'),
	rrest = require('../'),
    server = http.createServer(function (req, res){
		rrest.mongo(function(err, db, release){
			db.collection("mongotest", function(err, collection){
				if(err) return mongo_err(err, release);
				collection.findOne({id: 1}, function(err, doc){
					if(err) return mongo_err(err, release);
					res.sendjson(doc);
					release();
				});
			});
		});
	}).listen(rrest.config.listenPort);

var mongo_err = function(err, release){
	console.log(err);
	return release();
};

rrest.mongo(function(err, db, release){//Caution release!
	if(err) return mongo_err(err, release);
	db.collection('mongotest', function(err, collection){
		if(err) return mongo_err
		collection.save({id:1, name:'Mongodb rrestjs test!'}, {"safe":true}, function(err,r){
			if(err) return mongo_err(err, release);	
			release();
		});
	});
});



 request(
    { method: 'GET',
      uri: 'http://'+testconf.hostname+':3000/',},
    function(error, res, body) {
	  should.strictEqual(res.statusCode, 200);
	  var data = JSON.parse(body);
	  should.strictEqual(data.id, 1);
	  should.strictEqual(data.name, 'Mongodb rrestjs test!');
	  console.log('mongodb test ok!');
	  process.exit();
    })



