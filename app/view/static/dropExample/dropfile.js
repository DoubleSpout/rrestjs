/*
 * jquery html5 图片base64拖拽上传插件
 *
 * jQuery plugin for html5 dragging files from desktop to browser
 *
 * chrome & firefox & opear  (Not support ie6,7,8,9)
 */
(function($){
	jQuery.event.props.push("dataTransfer");
	var opts = {},
		empty = function(){},
		stop = function(e){return e.preventDefault() && false},
		default_opts = {
			url: '',
			paramname: 'userfile',
			oninputid : false,
			maxfiles: 5,
			maxfilesize: 1024*1024,
			ondrop:empty,
			beforeEach: empty,
			afterAll: empty,
			onerror: empty,
			uploadStarted: empty,
			uploadFinished: empty,
			progressUpdated: empty,
		},
		errors = ["BrowserNotSupported", "TooManyFiles", "FileTooLarge", "OnlySupportImages"],
		imagesSupport = ['jpeg', 'jpg', 'png', 'gif'],
		DropFile = function (){
			this.files = [];
			this.filesDone = 0;
			this.filesCount = 0;
			this.filesLength = 0;
		};
DropFile.prototype = {
	ondrop:function(event){
		return this.saveFiles(this.checkfiles(event.dataTransfer.files));
	},
	oninput:function(files){
		return this.saveFiles(this.checkfiles(files));
	},
	saveFiles:function(filesary){
		if(filesary){
			this.files = this.files.concat(filesary);
			opts.ondrop(filesary);
		}
		return false
	},
	genArray:function(filesary){//坑爹的files是对象不是数组，将其转化成数组
		var files = [];
		for(var i=0; i<filesary.length; i++){
			filesary[i].index = ++this.filesCount;
			files.push(filesary[i]);
		};
		return files;
	},
	checkfiles:function(files){//检查上传的file数组是否合法
		var files = files,
			wrongnum = 0;
		if (files === null || typeof files === 'undefined') return this.onerror(errors[0]);
		var	filesCount = this.files.length + files.length,//坑爹啊，这里获得的files不是数组！
			maxSize = opts.maxfilesize;
		if (filesCount < 1 || filesCount > opts.maxfiles) return this.onerror(errors[1]);
		files = this.genArray(files);
		files = files.filter(function(value){//判断是否超大
			if(value.size <= maxSize) return true;
			return wrongnum++ && false
		})
		if(files.length < 1) return this.onerror(errors[2]);
		if(wrongnum>0){
			this.onerror(errors[2], wrongnum);
			wrongnum = 0;
		}
		files = files.filter(function(value){//判断是否合法的图片文件
			return imagesSupport.some(function(imgVal){
				if(~value.type.indexOf(imgVal)) return true;
			}) ? true : wrongnum++ && false;;
		});
		if(files.length < 1) return this.onerror(errors[3]);
		if(wrongnum>0) this.onerror(errors[3], wrongnum);
		return files;
	},
	onchange:function(inputid){
		var that = this;
			$('#'+inputid).change(function(){
				that.oninput(this.files)
			})
	},
	onerror:function(errmsg, num){
		return opts.onerror(errmsg, num) && false;
	},
	remove:function(number){
		this.files = this.files.filter(function(value){
			return value.index != number;
		})
	},
	upload:function(){
		var that = this;
		that.filesLength = that.files.length;//获得上传文件的数量
		that.filesDone = 0;
		that.files.forEach(function(filesObj, index){
			opts.beforeEach(filesObj);//执行上传前的回调
		    try {
					var reader = new FileReader();				
					reader.readAsDataURL(filesObj);
					reader.onloadend = function(e){
						that.send(filesObj, this.result);//发送base64数据给后端
					};
			}catch(err) {
				return that.error(errors[0]);
			}
		});	
	},
	send:function(filesObj, base64String){
			var that = this,
				xhr = new XMLHttpRequest(),
				upload = xhr.upload;
			if(arguments.length === 1){
				var base64String = filesObj;
				filesObj = {index:0};
			}
			filesObj.currentProgress = 0;
			filesObj.startData = 0;
			filesObj.startTime = Date.now();
			upload.addEventListener("progress", function(event){
				that.progress(event, filesObj);
				}, false);		
			xhr.open("POST", opts.url, true);
			xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
			xhr.send('index='+filesObj.index+'&'+opts.paramname+'='+base64String.split(',')[1]); //发送给后端数据	
			opts.uploadStarted(filesObj);//上传开始回调  			
			xhr.onload = function() { 
			    if (xhr.responseText) {
				    filesObj.timeDiff = Date.now() - filesObj.startTime;
				    opts.uploadFinished(JSON.parse(xhr.responseText), filesObj);	
					that.filesDone++;
					if(that.filesDone == that.filesLength) opts.afterAll();
			    }
			};
		},
    progress:function(event, filesObj) {
		if (event.lengthComputable) {
			var loaded = event.loaded,
				percentage = Math.round((loaded * 100) / event.total);				
			if (filesObj.currentProgress != percentage) {				
				filesObj.currentProgress = percentage;	
				var now = Date.now(),
					diffTime = now - (filesObj.currentStart?filesObj.currentStart:filesObj.startTime),
				    diffData = loaded - filesObj.startData;
				filesObj.speed = Math.floor(diffData / diffTime); // KB per second
				filesObj.startData = loaded;
				filesObj.currentStart = now;
				opts.progressUpdated(filesObj);	
			}
		}
	},
	afterAll:function(){
		return opts.afterAll();
		}
}; 
	$.fn.dropfile = function(options) {
		opts = $.extend( {}, default_opts, options );
		var df = new DropFile();
		this.bind('drop', function(event){df.ondrop(event);return event.preventDefault() && false}).bind('dragenter', stop).bind('dragover', stop).bind('dragleave', stop);
		$(document).bind('drop', stop).bind('dragenter', stop).bind('dragover', stop).bind('dragleave', stop);
		if(opts.oninputid) df.onchange(opts.oninputid);
		return df;
	};
	
})(jQuery);