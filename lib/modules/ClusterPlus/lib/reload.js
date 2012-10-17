/*!
 * Cluster - reload
 * Copyright (c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 * Edit by Spout 2011
 */

var fs = require('fs'),
	path = require('path');
exports = module.exports = function(files, except){
	var protection = false,
		except = except;
	return function(ClusterPlus){
		if (!files) files = path.dirname(process.argv.slice(1)[0]);
		var check_watch = function(filepath){
			fs.stat(filepath, function(err, stats){
				if(err)  ClusterPlus._output('check_watch err:'+err);
				else if(stats.isDirectory() && !err) watch_file(filepath);		
			})
		};
		var watch_file = function(dirname){
			   fs.watch(dirname, function(event, filename){
					  var filepath = dirname+'/'+filename,
						  ary = filename.split('.'),
						  suffix = '.'+ary[ary.length-1];
					  ClusterPlus._output('文件：'+filepath+' 发生事件：'+event);

					  if(!protection && !~except.indexOf(suffix)){
						 protection = true;
						 ClusterPlus.restart();
						 setTimeout(function(){protection=false},ClusterPlus.num*1500)
					  }					
					  if(event == 'rename') process.nextTick(function(){check_watch(filepath)});
			   })
				ClusterPlus._output('ClusterPlus正在监控文件目录：'+dirname+'/');
			
			  }
		var loop_watch = function(filepath){
				watch_file(filepath);
				var fs_array = fs.readdirSync(filepath);
				fs_array.forEach(function(f){
					var path = filepath+'/'+f;
					if(fs.statSync(path).isDirectory()) loop_watch(path);
				})
				return arguments.callee;
			}
		 loop_watch(files);
	};
};
