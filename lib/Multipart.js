/*
*Multipart.js 是利用 formidable 模块接收post或者put请求的body体或者二进制的文件
*
*exports Multipart 类
*/

//settings 参数：
//settings={
//filedir:'/tmp/',//存放文件的临时地址，建议等上传完成以后再移动至保存文件夹
//onProgress:function(bytesReceived, bytesExpected){},
//onEnd:function(formidableobj){},
//onError:function(error, formidableobj){}
//}

var formidable = require('formidable'),
	outerror = require('./Outerror'),
	RestUtils = require('./RestUtils'),
	qs = require('qs'),
	msg =  require('./msg/msg'),
	genparamdot = require('./RestReqParam'),//拼装param对象
	postLimit = _restConfig.postLimit,//上传文件大小限制
	onListen = { //默认配置
		onProgress:function(bytesReceived, bytesExpected){},
		onEnd:function(formidableobj){},
		onError:function(error, formidableobj){}
	},
	Multipart = module.exports = function(req, filedir, settings){
		if(!(this instanceof arguments.callee)) return new arguments.callee(req, filedir, settings);
		formidable.IncomingForm.call(this, null);
		this.restFile = {};//存放post或put的文件信息
		this.restParam = {};//存放post或put传递的参数
		this.uploadDir = filedir || (_restConfig.baseDir + _restConfig.uploadFolder);//上传文件地址
		if('function' == typeof settings) var callback = {onEnd:settings}; //如果最后一个参数传递了函数，则认为是end回调
		this._intial(req, this._serial(callback||{})); //初始化设置
        
        if(this.error) return;
        
		/*利用代码注入 formidable 模块*/
		var parseobj = this._parser;
		parseobj.end = function(){//重写end方法
			 var fields = genparamdot(qs.parse(this.buffer));
				 for (var field in fields) {
					 this.onField(field, fields[field]);
				 }
				this.buffer = '';
				this.onEnd();
		};
		
	};
Multipart.prototype = {
	__proto__:formidable.IncomingForm.prototype,
	_serial:function(callback){ //读取默认配置
		var cb={};
		for(var j in onListen){
			cb[j] = callback[j] || onListen[j];
		}
		return cb;
	},
	_intial:function(req, callback){
		var that = this,
			limitsize = postLimit,
			endExe = false,
			errornum = 0;
		

		this.on('progress', function(bytesReceived, bytesExpected){ //传输中，用来做上传进度用
			callback.onProgress(bytesReceived, bytesExpected);
			bytesReceived>limitsize && (errornum++ === 0) && that.emit('error', 'request body too big!');
		})
		.on('file', function(field, file) { //文件传输完毕，保存文件信息
			that.restFile[field] = {
				size:file.size,
				name:file.name,
				type:file.type,
				hash:file.hash,
				length:file.length,
				filename:file.filename,
				mime:file.mime,
				path:file.path,
				lastModifiedDate:file.lastModifiedDate
			};
		})
		.on('field', function(name, value){ //参数传输完毕
				that.restParam[name] = value;
			})
		.on('end', function(){//上传成功
			if(endExe) return;
			endExe = true;
			if(errornum===0){
				var param = that.restParam;
				req._restPostData = param; 
				callback.onEnd({
					param : param,
					file : that.restFile
				});
			}
		})
		.on('error',function(err){//出错记录错误日志
			RestUtils.errorRes(req._restRes, msg.resmsg.postputError,400);
			outerror(msg.parse(msg.errmsg.postputError, err));
			callback.onError(err,{
				param : that.restParam,
				file : that.restFile
			});	
			
		})
		.parse(req);
	}
}