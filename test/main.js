/*
测试主要的模块,跑全部的测试用例
跑main.js之前需要启动mongodb
跑完main.js
还需要跑以下脚本手动测试：
1、example/MultiProcess.js
2、example/rrestpipe.js

*/
var fs = require('fs'),
	fs_array = fs.readdirSync(__dirname).filter(function(v){
		var state = fs.statSync(__dirname+'/'+v);
		return v !== 'main.js' && !state.isDirectory() && v !=='testconf.js';
	});

var spawn = require('child_process').spawn;

var gotest = function(filename){
		var haserr = false;
		var testp = spawn('node', [filename]);
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
		process.exit();
	}
	return arguments.callee;
}()