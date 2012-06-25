var RestUtils = require('./RestUtils'),
	path = require('path'),
	outerror = require('./Outerror'),
	msg =  require('./msg/msg'),
	fs = require('fs'),
	baseDir = _restConfig.baseDir,
	respage = function(res, filepath, fn){
			fs.readFile(baseDir+filepath, 'utf-8', function (err, data) {
				 if (err) return fn(err);
				 res.statusCode = 404;
				 res.send(data);
				 fn(null, data);
			});		
	};
	if(!path.existsSync(baseDir+'/404.html')){//如果路径不存在，则创建它
		module.exports = function(res, filepath, fn){
		var fn = fn || function(){};		
			if(!filepath) {
				RestUtils.errorRes404(res);
				fn();
			}
			else respage(res, filepath, fn);
		};
	}
	else{
		module.exports = function(res, filepath, fn){
			var fn = fn || function(){};	
			if(!filepath) respage(res, '/404.html', fn);	
			else respage(res, filepath, fn);
		};
	}

