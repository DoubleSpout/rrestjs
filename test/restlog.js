/*
	基本测试，log 分文件 例子
*/





var fs = require('fs');
var logsdir = __dirname+'/mylogs';
var should = require('should');
var path = require('path');
var testconf = require('./testconf.js');
module.exports.rrestjsconfig = {
	listenPort:3000,
	isLog:true, //是否开启日志，过多的记录日志会影响性能，但是能记录系统运行情况
	logLevel:'info',//['trace','debug','info','warn','error', 'fatal'] 日志等级
	logPath:'/mylogs', // "/mylogs/console.log" 日志存放目录
	logMaxSize:20, //单个日志文件大小
	logFileNum:10, //当单个日志文件大小达标时，自动切分，这里设置最多切分多少个日志文件
	baseDir: path.join(__dirname),
};
var rrest = require('../');


var logsary = fs.readdirSync(logsdir)
for(var i =0; i<logsary.length; i++){
	fs.unlinkSync(logsdir+'/'+logsary[i]);
}


rrest(function(){
    restlog.info('info');
    restlog.warn('warn');
    restlog.error('error');
    restlog.fatal('fatal');

})



setTimeout(function(){
	var should = require('should');
	var fatal = fs.readFileSync(__dirname+'/mylogs/restlog_main.log', 'utf-8');
	var error = fs.readFileSync(__dirname+'/mylogs/restlog_main.log.1', 'utf-8');
	var warn = fs.readFileSync(__dirname+'/mylogs/restlog_main.log.2', 'utf-8');
	should.strictEqual(fatal.indexOf('FATAL') !== -1, true);
	should.strictEqual(error.indexOf('ERROR') !== -1, true);
	should.strictEqual(warn.indexOf('WARN') !== -1, true);
	console.log('restlog test done!')
	process.exit();
},3000);









