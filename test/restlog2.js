/*
	基本测试，log 多进程 例子
*/





var should = require('should');
var path = require('path');
var testconf = require('./testconf.js');
module.exports.rrestjsconfig = {
	listenPort:3000,
	isLog:true, //是否开启日志，过多的记录日志会影响性能，但是能记录系统运行情况
	logLevel:'info',//['trace','debug','info','warn','error', 'fatal'] 日志等级
	logPath:'/mylogs', // "/mylogs/console.log" 日志存放目录
	baseDir: path.join(__dirname),
    isCluster:true, //是否开启多进程集群
	isClusterAdmin:true,//进程监听管理功能是否开启
    ClusterNum:4 //开启的进程数
};
var rrest = require('../');

rrest(function(){
    restlog.info('info');
    restlog.warn('warn');
    restlog.error('error');
    restlog.fatal('fatal');

})

if(rrest.forkid == 'master'){
    
var fs = require('fs');
var logsdir = __dirname+'/mylogs'
var logsary = fs.readdirSync(logsdir)
for(var i =0; i<logsary.length; i++){

	fs.unlinkSync(logsdir+'/'+logsary[i]);
    console.log(logsdir+'/'+logsary[i]+ ' del sucess!')
}


setTimeout(function(){
	var should = require('should');
	var f1 = fs.readFileSync(__dirname+'/mylogs/restlog_0.log', 'utf-8');
	var f2 = fs.readFileSync(__dirname+'/mylogs/restlog_1.log', 'utf-8');
	var f3 = fs.readFileSync(__dirname+'/mylogs/restlog_2.log', 'utf-8');
    var f4 = fs.readFileSync(__dirname+'/mylogs/restlog_3.log', 'utf-8');
	should.strictEqual(f1.indexOf('FATAL') !== -1, true);
	should.strictEqual(f2.indexOf('ERROR') !== -1, true);
	should.strictEqual(f3.indexOf('WARN') !== -1, true);
    should.strictEqual(f4.indexOf('WARN') !== -1, true);
	console.log('restlog2 test done!')
	process.exit();
},10000);

}








