/*
*autoStatic.js 文件是自动响应静态文件模块
*
*主要作用是会根据是否开启parse整合css和js文件做出不同响应
*
*如果未开启 parse 功能，则根据get请求路径自动去 staticFolder 响应静态文件
*
*如果开启parse功能，并使用parse功能，请求的是js文件，则会利用ugliyf压缩合并以后响应
*
*如果开启parse功能，并使用parse功能，请求的是css文件，则会利用less编译，然后压缩合并响应
* 
*exports 根据情况输出响应函数
*/
var AsyncProxy = require('./modules/AsyncProxy'),
	RestUtils = require('./RestUtils'),
	fs = require('fs'),
	path = require('path'),
	less = require('less'),
	msg =  require('./msg/msg'),
	outerror = require('./Outerror'),
	compressCss = require('./modules/compressCss'),//压缩CSS方法
	uglifyjs = function(str){//使用uglify-js压缩，生成压缩后的js文件
		var jsp = require("uglify-js").parser,
		    pro = require("uglify-js").uglify,		
		    orig_code = str,
			ast = jsp.parse(orig_code); // parse code and get the initial AST
		ast = pro.ast_mangle(ast); // get a new AST with mangled names
		ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
		var final_code = pro.gen_code(ast); // compressed code here
		return final_code+';';
	},
	normalize_query = RestUtils.normalize_query,
	autoStatic = _restConfig.autoStatic,
	staticFolder = _restConfig.baseDir + _restConfig.staticFolder,
	staticParse = _restConfig.staticParse,
	staticParseName = _restConfig.staticParseName,
	staticParseCacheTime = _restConfig.staticParseCacheTime,
	staticParseMaxNumber = _restConfig.staticParseMaxNumber,
	staticParseCacheFolder = _restConfig.baseDir+_restConfig.staticParseCacheFolder,
	reg = new RegExp("^"+autoStatic+"/"),
	staticObj = {
		parseStaticCache:{},
		autoStaticFn:function(req, res){
			var filepath = staticFolder+'/'+req.path.slice(1).join('/'), //拼装静态文件绝对地址
				lessType = staticObj.getLessType(filepath);//根据绝对地址获取后缀名
			if(lessType === 'less'){//如果是css文件则去生成less.前缀的css文件名
				staticObj.genless(filepath, function(err, csspath){//生成编译后的less的css文件，返回err和csspath两个参数
					if(err) return RestUtils.errorRes(res, err.msg, err.scode);
					res.sendfile(csspath);
				});
			}
			else res.sendfile(filepath);
		},
		getMimeType:function(path){//根据路径地址获取后缀名
			var po = path.lastIndexOf('.')+1;
			return path.slice(po).toLowerCase();
		},
		getLessType:function(path){
			if(/.less$/.test(path) || /.less.css$/.test(path)) return 'less';//增加.less文件的判断
			//预留接口判断其他例如less的样式表
			return false;
			},
		genless:function(filepath, cb){//生成编译后的less文件，即是在原来css文件加前缀less.			
			var cb = cb || function(){},
			    fileary = filepath.split('/'),
				filedir = fileary.slice(0, fileary.length-1).join('/');

			fs.readFile(filepath, {encoding :'utf-8'},function(err, data){//根据请求读取目录
				parser = new(less.Parser)({
					paths: [filedir] // Specify search paths for @import directives
				});
				if(err) return cb({msg:msg.resmsg.notFound, scode:404});//如果文件不存在，则cb(err)
				parser.parse(data, function (err, css) {//开始编译less文件
					if(err) return cb({msg:msg.resmsg.lessError, scode:500});//如果编译出错，则cb(err)
					var css = css.toCSS(),
						po = filepath.lastIndexOf('/')+1,
						path = filepath.slice(po),
						lesspath = filepath.replace(path, 'compile.'+path);//根据元有文件路径拼装成带less.为前缀的less css文件
					fs.writeFile(lesspath, css, {encoding :'utf-8'}, function(err){//根据 lesspath 生成编译好的css文件
					if(err) return cb({msg:msg.resmsg.lessWriteError, scode:500});//如果写入出错
					cb(null, lesspath);//执行回调 传参 lesspath
					})
				});					
			})	
		},
		parse:function(type, filePathArray, md5str, callback){
			var as = AsyncProxy(),//实例化异步代理库 AsyncProxy
				ary = [],//存放异步方法的数组	
				fileary = [],//存放buffer.toString()的css或js文档
				wrong = 0,//错误记录，大于0说明有错误
				genlessnum = filePathArray.length, //待生成less的文件数
				gencount = 0, //已经生成的less文件数
				readfile = function(value, index, type){
					
					var value = value.replace(autoStatic, ''),//静态文件路径去掉前缀
						staticPath = staticFolder+value,//文件的绝对路径
						recfn = function(rec){
								fs.readFile(staticPath, {encoding :'utf-8'}, function(err, data){
									if(err) wrong++;
									else{//坑爹的uglify，末尾不加';'号而且有错还得用户加try，我去提意见
										try{
											fileary[index] = zipFn(data);
										}
										catch(e){
											fileary[index] = data;
										}
									}
									rec();//异步库方法，表示此异步正常返回
								});
						};
					if(type === 'less'){
						staticObj.genless(staticPath, function(err, lesspath){
							 if(err) return callback(err.msg);
							 staticPath = lesspath;//如果是css，则将 staticPath 修改为 lesspath
							 if(++gencount >= genlessnum){ //如果所有的css都生成完成
								 process.nextTick(function(){
									as.ap.apply(as, ary); //开始合并css
								 })
							 }
						});						
					}
					return recfn;//返回 recfn 函数作为异步函数
				},
				allComplete = function(){//当所有异步的 recfn 都执行完毕后执行
					if(wrong>0) return callback(msg.resmsg.parseNotExist);//如果有错误，则部分文件不存在
					fs.writeFile(staticParseCacheFolder+'/'+md5str, fileary.join(''), {encoding :'utf-8'}, function(err){
						if(err) return callback(msg.resmsg.parseCreateCacheError);//如果生成缓存文件失败
						callback(null, staticParseCacheFolder+'/'+md5str);//生成成功，将缓存路径返回给callback
						as = null;//垃圾回收
					})
				};

				if(type === 'css' || type==='less'){
					var zipFn = compressCss;//css 压缩模块
				}
				else if(type === 'js'){
					var zipFn = uglifyjs;//js 压缩模块
				}
				else return callback(msg.resmsg.parseTypeError);
				filePathArray.forEach(function(value, index){//为每一个路径添加fs访问路径

					var vtype = staticObj.getMimeType(value);
					if(!reg.test(value)) return wrong++;//如果访问路径不正确
					if(vtype !=='css' && vtype !== 'js' && vtype !== 'less')  return wrong++;//如果后面的文件不是css也不是js
					ary.push(readfile(value, index, vtype));
				});	
				if(wrong>0) return callback(msg.resmsg.parseError);
				ary.push(allComplete);	
				if(type !== 'less') as.ap.apply(as, ary);
			return true;				
		},
		createCache:function(type, filePathArray, md5str, res){//生成缓存的方法
			var callback = function(errmsg, filepath){//生成缓存以后的回调，如果有错误也会执行
					if(errmsg) return RestUtils.errorRes(res, errmsg);//如果生成缓存失败，则输出错误		
					staticObj.parseStaticCache[md5str] = {//如果正常返回，则创建和更新缓存
						timestamp:Date.now(),
						filepath:filepath,
					}
					res.sendfile(filepath);
				};
			staticObj.parse(type, filePathArray, md5str, callback);//根据生成缓存文件函数返回的路径输出缓存				
		},
	};
if(!staticParse){//如果没有开启静态文件整合功能则直接自动输出静态文件
	module.exports = staticObj.autoStaticFn;

}
else{//开启静态文件整合压缩
	module.exports = function(req, res){
		var parsePath = req.getparam[staticParseName];		
			if(typeof parsePath === 'undefined' || !parsePath) return staticObj.autoStaticFn(req, res); //开启功能但未使用此方法，则直接自动输出，例如请求是图片或者txt
			var ary = parsePath.split('|'),
				type = staticObj.getMimeType(ary[0]),
				md5str = RestUtils.md5(parsePath)+'.'+type,//生成md5字符串
				pobj = staticObj.parseStaticCache[md5str];
				ary.map(function(v){
					return normalize_query(v);
				});

			if(ary.length>staticParseMaxNumber) return RestUtils.errorRes(res, msg.resmsg.parseTooLong);//如果超长，则报错
			if(pobj && (Date.now() - staticParseCacheTime < pobj.timestamp)){//如果有缓存，并且缓存未超时,正常输出缓存文件			
				var p = pobj.filepath;
				path.exists(p, function(exist){
					if(exist) {
						res.sendfile(p, function(err){ 
							if(err) outerror(msg.parse(msg.errmsg.parseCacheNotFound+p, err));
						});
					}
					else staticObj.createCache(type, ary, md5str, res);//如果读取缓存失败，则去生成缓存	
				});
			}
			else{
				staticObj.createCache(type, ary, md5str, res);//去生成缓存
			}
	}
}
	