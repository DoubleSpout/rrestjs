/*
测试主要的模块,跑全部的测试用例
跑main.js之前需要启动mongodb
跑完main.js
还需要跑以下脚本手动测试：
1、example/MultiProcess.js
2、example/rrestpipe.js

*/

var fs = require('fs');
var path = require('path');
var p = path.join(__dirname,'mylogs');

if(fs.existsSync(p)){
	var fileArray = fs.readdirSync(p);//获取所有文件名

	fileArray.forEach(function(v,i){ //清空文件夹
		fs.unlinkSync(path.join(p,v));
	})
	
	fs.rmdirSync(p);

	console.log('delete mylogs folder');
}








var fs = require('fs'),
	fs_array = fs.readdirSync(__dirname).filter(function(v){
		var state = fs.statSync(__dirname+'/'+v);
		return v !== 'main.js' && !state.isDirectory() && v !=='testconf.js';
	});

var spawn = require('child_process').spawn;

var gotest = function(filename){
		var haserr = false;
		if(filename == 'devtest.js' || filename == 'multiListen.js'){
			var testp = spawn('node', [filename,'-d']);
		}
		else{
			var testp = spawn('node', [filename]);
		}
		testp.stdout.on('data', function (data) {
			console.log('stdout: ' + data);
		});

		testp.stderr.on('data', function (data) {
		 console.log('stderr: ' + data);
		 haserr = true;
		});
		testp.once('exit',function(){
	
			if(haserr) process.exit();
			loop(); 
		});
	}

var loop = function(){

	if(fs_array.length>0){
		gotest(fs_array.pop());	
	}
	else{
		console.log('all test done!good!!!!');
		console.log('do more test example/MultiProcess.js')
		console.log('do more test example/rrestpipe.js')
		console.log('do more test example/poolMongodb.js')
		process.exit();
	}
	return arguments.callee;
}()