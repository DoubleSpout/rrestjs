var events =  require("events"),
    AsyncProxy = module.exports = function(ischain){
	var me = arguments.callee;
	if(!(this instanceof me)) return new me(ischain);
	this.emitter = new events.EventEmitter();
	this.eventname = 'AsyncProxy';
	this.ischain = ischain||false; //是否链式调用,默认是false
};
AsyncProxy.prototype.addlistener = function(){ //建立事件监听函数
	var ap = this;
	ap.emitter.on(ap.eventname,function(order){
		if(--ap.length===0){
			ap.callback();
			ap.emitter.removeAllListeners(ap.eventname);
		}
	})
};
AsyncProxy.prototype.rec = function(order){ //当异步返回入口
	this.emitter.emit(this.eventname, order); 
	if(this.ischain && ++order<this.asyncs.length){ this.asyncs[order](order);}
	return {total:this.asyncs.length, rec:this.asyncs.length - this.length}
};
AsyncProxy.prototype.recfunc = function(callback){
	var ap = this;
	return function(order){
		return callback(function(){
			return ap.rec(order);
		});		
	}	
};
AsyncProxy.prototype.ap = function(){ //主入口
	var ap = this, i=0, len = arguments.length - 1;
	ap.asyncs = [].slice.apply(arguments, [0, len]).map(function(value){
		return ap.recfunc(value);
	}); //将参数eventname1-n转存成events 数组
	ap.callback = arguments[len];
	ap.addlistener();
	if((ap.length=ap.asyncs.length)&&!ap.ischain){ //如果非链式调用
		while(i++ < ap.asyncs.length){ ap.asyncs[i-1](i-1);}
	}
	else ap.asyncs[0](0);
	return ap.asyncs.length;
};