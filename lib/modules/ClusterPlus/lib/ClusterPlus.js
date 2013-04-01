/*启动cluster,并且根据设置启动多个node.js进程监听不同端口，并且自动重启*/
var cluster = require('cluster'),
	outerror = require('../../../Outerror'),
	AsyncProxy = require('../../AsyncProxy'),//加载 AsyncProxy 异步管理库，虽然小，但是强悍！
	reload = require('./reload'),//加载reloadjs模块，当有文件改动时，自动重启所有子进程
		util = require('util'),
	settings = {//默认配置
		logger:false,
		iskillz : false,
		num: 1,
		Heartbeat:false,
		except:[],
		ClusterMaxMemory:false,
		CreateCallback:function(){},
		DeadCallback:function(){},
		RestartCallback:function(){},
		reload:true
	};	

var ClusterPlus = module.exports = function(setting){//主进程类
		var that = this,
			me = arguments.callee,
			setting = setting || {};
		if(!(this instanceof me)) return new me(setting);//实例化ClusterPlus
		if(cluster.isWorker) return new ClusterChild(that._serialsettings(setting));//如果是子进程
		this.workobj = [];//存放childprocessid的数组
		this._hdary = [];//存放hb的时间戳
		this._forkary = [];//存放fork以后的对象，私有
		this._dead = []; //存放挂掉的childprocess序号
		this._overProcess = [];
		this.async = AsyncProxy();//实例化AsyncProxy异步代理类，这里使用链式调用，一个个启动进程
		Object.defineProperty(this, "_PidGetNum",{set:function(newValue){//定义 _PidGetNum 属性
				var num = that.workobj.indexOf(newValue);
				if(~num) _PidGetNum = {num:num, pid:newValue}; //知道指定pid的num
				else _PidGetNum=false;//当找到指定的pid的num,返回V对象，否则返回FALSE
		},get:function(){return _PidGetNum;},enumerable:false});
		this._intial(that._serialsettings(setting));//初始化setting对象
		if(this.reload  &&  that.num == 1){//配置reload.js模块,默认只有num:1时才开启relaod
			var file = this.reload == true?'':this.reload;
			me.reload = reload(file, this.except)(this);
			if(this.iskillz) require('./KillZombie')(this);//启动僵尸进程消灭函数
		}
	}		
ClusterPlus.prototype = {
		__proto__:cluster,
		_create:function(num, callback){//fork子进程
			var that = this,
				callback = callback || function(){};
				var cfork = cluster.fork({_num:num});
					cfork.on('message', function(data){
					   if(typeof data._pid != 'undefined'){//接收子进程的pid，存入 ClusterPlus.workobj 数组中
							  if(data._cmd === 'heartbeat' && that.setting.Heartbeat){
								   var num = that.workobj.indexOf(data._pid);
								   that._hdary[num] = Date.now();//更新心跳的时间戳
								   if(that.setting.ClusterMaxMemory){//如果开启内存检测并且超过1024的话直接kill杀死
										var rss = data._memory.rss/(1024*1024);
										if(rss>that.setting.ClusterMaxMemory){
											outerror('the worker pid: '+data._pid+',has used memory: '+rss+'mb has too large to '+that.setting.ClusterMaxMemory+'mb, now be killing!');
											that._output('进程号： '+data._pid+'内存使用'+rss+'超过标准的'+that.setting.ClusterMaxMemory+', 已经杀死');
											that._kill([data._pid]);
										}
								   }
								   return;
							   }
							   var num = data._num, pid = data._pid;
							   if(that.workobj[num]){
									that._overProcess.push(pid);
									that._kill([pid]);
							   }
							   else {
								  that._dead = that._dead.filter(function(val){
										 return val != num;
										})
								  that._PidGetNum = that.workobj[num] = pid;
								  callback(null, that._PidGetNum);
							   }
					   }
					   else if(data._sync){
								that._forkary.forEach(function(value){
									value.send(data);
								});
					   }
			  		})
				that._output('子进程第 '+num+'个，已经启动。');
				that._forkary[num] = cfork;
				return that;
			},
		_output : function(str){//对外输出
				if(this.logger) 'function'== typeof this.logger?this.logger(str):console.log(str);
				return this;
			},
		_restart:function(num, callback){//重新启动核心函数
				var num =  'object' != typeof num?[num]:num,
					that = this,
					callback = callback || function(){}
					async = [];//存放 AsyncProxy 异步代理调用的参数
				num.forEach(function(value, i){
					if(parseInt(value) != value) return;
					async.push(function(value){//闭包，将异步代理的回调函数存入数组中
									return function(receive){
										that._create(value, function(err, data){
											that.RestartCallback(err, data);	
											receive();
										});
									};
						}(value));
					outerror('worker has been restarted , the number is: '+value);
					that._output('已经开始重启第 '+value+'个子进程。');
				});
				async.push(callback);
				that.async.ap.apply(that.async, async);
				return this;
			},
		_checkOverProcess:function(pid){
			var that = this,
				len = this._overProcess.length;
			this._overProcess = this._overProcess.filter(function(val){
				if(val == pid) that._output('多余的进程已经杀死，进程号：'+pid);
				return val != pid
			})
			return this._overProcess.length != len;
			},
		_serialsettings:function(setting){//序列化用户传递的setting属性，修改为私有属性，不可写，不可枚举
				if('object' != typeof setting) settings.num = setting || settings.num;
				else{
					for(var key in setting) settings[key] = setting[key];	
				}
				for(var key in settings) Object.defineProperty(this, key, {value:settings[key], writable:false, enumerable:false});			
				this.setting = settings
				return settings;
			},
		_ondeath:function(){
				var that = this,
					deadListener = function(worker){				
							var worker = worker.pid?worker:worker.process;//兼容v0.8版本
							if(that._checkOverProcess(worker.pid)) return;
								outerror('worker ' + worker.pid + ' dead!');
								that._output('worker ' + worker.pid + ' 挂掉了！');
								that._PidGetNum = worker.pid;
							if(that._PidGetNum){//如果能根据pid找到子进程num值，则
										that.workobj[that._PidGetNum.num] = false;
										if(!that._dead.some(function(val){return val == that._PidGetNum.num})) that._dead.push(that._PidGetNum.num);								
										that._restart(that._PidGetNum.num).DeadCallback(null, that._PidGetNum);
									}
							else {//如果找不到子进程值，则认为异常退出
									outerror('worker has unexpected error, pid ：'+worker.pid);
									that._output('子进程可能有语法错误，异常退出：'+worker.pid);		
							}
					};
				  cluster.on('exit', function(worker){//增加子进程监听函数，当death触发
					  deadListener(worker);
				  });
				  cluster.on('death', function(worker){//增加子进程监听函数，当death触发
					  deadListener(worker);
				  });
				return this;
			},
		_intial : function(setting){//初始化函数
				var that = this;
				while(setting.num--) this._create(setting.num);
				this._ondeath();
				if(setting.Heartbeat){
					setInterval(function() {
							var time = new Date().getTime()
							that._hdary.forEach(function(hb, i){
							if(hb && hb + setting.Heartbeat*3.5 < time) {
								that._hdary[i] = false;
								that._kill([that.workobj[i]]);
								}
							});
					}, setting.Heartbeat);//给予子进程3次不通知主进程的时间
				}
				return this;
			},
		_kill : function(ary){//杀死数组中的进程pid
				var that = this;
					ary.forEach(function(pid){
						if(pid){
							try{
								process.kill(pid, 'SIGTERM');
								}
							catch(err) {
								outerror('杀死进程'+pid+'失败：'+JSON.stringify(err));
								that._output('杀死进程'+pid+'失败：'+err)._PidGetNum = pid;
								}	
						}
					})		
				return this;						
			},
		restart:function(pid){//对外Api，可以根据pid来重启子进程，不传参数示为全部重启
			var that = this,
				pid = pid||this.workobj,
			    ary = 'object' != typeof pid?[pid]:pid,
				RestartAll = function(ary){//如果杀死失败，则将错误的子进程序号存入_dead数组中
							that._dead.length = 0;
							that._kill(ary);
				};		
			if(that._dead.length>0) that._restart(that._dead, function(){RestartAll(ary)});
			else RestartAll(ary);
			return this;
		}
		// restart 结束
	}		


var ClusterChild = function(setting){//子进程类
	Object.defineProperty(this, 'pid' , {value:process.pid, writable:false});
	this.work_num = process.env['_num'];
	this._listen(setting);
	}
ClusterChild.prototype={
	__proto__:cluster,
	_listen:function(setting){
		var that = this;

		process.send({_pid:that.pid, _num:that.work_num, _men:process.memoryUsage()}); 	
		setting.CreateCallback(null, {num:that.work_num, pid:that.pid});

		process.on('message', function(data) {
			try{
				 if(data._sync && data.pid !== that.pid){

						eval(data.data);
						ClusterPlus.prototype._output.call(setting, that.pid+'同步数据成功');

				}
			}
			catch(err){
				ClusterPlus.prototype._output.call(setting, '子进程接收message出现错误: '+err);
				setting.CreateCallback('Fail to get message:'+err);
				}
			});	
		if(setting.Heartbeat){
			setInterval/*setTimeout*/(function report(){//每隔一定时间进行一次心跳，检测子进程的内存使用情况和健康状态
				process.send({_cmd: "heartbeat", _memory: process.memoryUsage(), _pid:that.pid});
			}, setting.Heartbeat);
		}
		process.on('SIGTERM', function(data) {
			ClusterPlus.prototype._output.call(setting, '收到重启信息，子进程  '+that.pid+'  关闭中...');
			process.exit(0);
		})
	}	
}