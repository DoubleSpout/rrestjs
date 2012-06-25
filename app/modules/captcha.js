/*最多支持99个,后缀名是png*/
var captchapath = _rrest.config.baseDir + '/view/captcha_pic/',
	captcha_ary = [
{id:1, url:captchapath,value:'东洋砍刀'},
{id:2, url:captchapath,value:'菊花一朵'},
{id:3, url:captchapath,value:'树叶'},
{id:4, url:captchapath,value:'鸭子'},
{id:5, url:captchapath,value:'蝴蝶'},
{id:6, url:captchapath,value:'小狗'},
{id:7, url:captchapath,value:'小鱼'},
{id:8, url:captchapath,value:'老鼠'},
{id:9, url:captchapath,value:'鼻涕猪'},
{id:10, url:captchapath,value:'黄色小老虎'},
{id:11, url:captchapath,value:'小白兔'},
{id:12, url:captchapath,value:'小龙'},
{id:13, url:captchapath,value:'小牛'},
{id:14, url:captchapath,value:'小猴子'},
{id:15, url:captchapath,value:'公鸡'},
{id:16, url:captchapath,value:'电脑'},
{id:17, url:captchapath,value:'三本书'},
{id:18, url:captchapath,value:'摄像头'},
{id:19, url:captchapath,value:'鸭子'},
{id:20, url:captchapath,value:'你好'},
{id:21, url:captchapath,value:'中国娃娃'},
{id:22, url:captchapath,value:'摩托头盔'},
{id:23, url:captchapath,value:'面具'},
{id:24, url:captchapath,value:'喇叭'},
{id:25, url:captchapath,value:'小猫和小鱼'},
{id:26, url:captchapath,value:'小猫'},
{id:27, url:captchapath,value:'胶片'},
{id:28, url:captchapath,value:'壁虎'},
{id:29, url:captchapath,value:'五角星'},
{id:30, url:captchapath,value:'耐克足球'},
{id:31, url:captchapath,value:'阿迪达斯足球'},
{id:32, url:captchapath,value:'puma足球'},
{id:33, url:captchapath,value:'足球场'},
{id:34, url:captchapath,value:'邮票'},
{id:35, url:captchapath,value:'耳机'},
{id:36, url:captchapath,value:'打印机'},
{id:37, url:captchapath,value:'单反相机'},
{id:38, url:captchapath,value:'大力神杯'},
{id:39, url:captchapath,value:'草坪'},
{id:40, url:captchapath,value:'哨子'},
{id:41, url:captchapath,value:'足球和草坪'},
{id:42, url:captchapath,value:'下大雨'},
{id:43, url:captchapath,value:'雷阵雨'},
{id:44, url:captchapath,value:'下雪'},
{id:45, url:captchapath,value:'太阳'},
{id:46, url:captchapath,value:'旧式电话'},
{id:47, url:captchapath,value:'两顶帽子'},
{id:48, url:captchapath,value:'夹子'},
{id:49, url:captchapath,value:'圣诞树'},
{id:50, url:captchapath,value:'箱子'},
{id:51, url:captchapath,value:'闹钟'},
{id:52, url:captchapath,value:'help'},
{id:53, url:captchapath,value:'鲸鱼'},
{id:54, url:captchapath,value:'松鼠'},
{id:55, url:captchapath,value:'胖猪'},
{id:56, url:captchapath,value:'小鸡'},
{id:57, url:captchapath,value:'企鹅'},
{id:58, url:captchapath,value:'小老鼠吃奶酪'},
{id:59, url:captchapath,value:'乌龟'},
{id:60, url:captchapath,value:'加减乘除'},
{id:61, url:captchapath,value:'螃蟹'},
{id:62, url:captchapath,value:'吉他'},
{id:63, url:captchapath,value:'救生圈'},
{id:64, url:captchapath,value:'棒冰'},
{id:65, url:captchapath,value:'滑板'},
{id:66, url:captchapath,value:'伞'},
{id:67, url:captchapath,value:'PSP正面'},
{id:68, url:captchapath,value:'毽子'},
{id:69, url:captchapath,value:'PSP背面'},
{id:70, url:captchapath,value:'三角圆圈方框叉'},
{id:71, url:captchapath,value:'男孩'},
{id:72, url:captchapath,value:'女孩'},
{id:73, url:captchapath,value:'感叹号'},
{id:74, url:captchapath,value:'液晶电视'},
{id:75, url:captchapath,value:'空购物车'},
{id:76, url:captchapath,value:'满购物车'},
{id:77, url:captchapath,value:'剪刀'},
{id:78, url:captchapath,value:'房子'},
{id:79, url:captchapath,value:'铃铛'},
]







var c_a  = captcha_ary,
	mongo = _rrest.mongo,//连接mongo数据库方法
	get_id = require('./stools').get_id,
	captcha={
		lenth : c_a.length, //验证码题目数组长度
		canum : 4, //每次出几个题目，这个值不能大于上面的
		//cutpo : 5, //生成字符串截断位置，加密用
		dbcolname:'piccaptcha',//验证码集合名称
	};
captcha.generate = function(id){//生成验证码方法
	var ts = (new Date()).getTime()+'';
	if(parseInt(id, 10)<10){
		var id = '0'+id;
	}
	var head = 10 + Math.ceil(Math.random()*89),
		cutpo = head.toString().slice(-1);
	var	front = ts.slice(0, cutpo),
		back = ts.slice(cutpo);
		res = head+front+id+back;
		return res;
}
captcha.decode = function(str){//验证码解码
	var head  = str.slice(1,2),
		str = str.slice(2),
		tsfront = str.slice(0, parseInt(head, 10)),
		id = str.slice(parseInt(head, 10), parseInt(head, 10)+2),
		intid = parseInt(id, 10),
		tsback = str.slice(parseInt(head)+2),
		ts = tsfront + tsback,
		now = (new Date()).getTime();
	if(now - ts > 1000*15) return false;
	if(intid != id) return false;
	return intid;	
}
captcha.creat = function(cb){ //用户打开页面创建验证码
	var ca = [];
	for(var j=0;j<c_a.length;j++){ //这里需要深度复制数组，因为数组内的每项都是对象
		ca[j]={}
		for(var i in c_a[j]){
			ca[j][i] = c_a[j][i]
		}
	}
	var u_obj = this.getrandmon(ca, this.canum); //返回给用户做题目的数组
	captcha.mongodbcreat(u_obj, cb);
}
captcha.mongodbcreat = function(u_obj, cb){//去mongodb数据库创建验证码
	var ary = u_obj.ca_ary,
		po =  u_obj.po;
	mongo(function(err, db, release){
		if(err) return;
		db.collection(captcha.dbcolname, function(err, collection){
			if (err){ 
				release();
				restlog.err('创建验证码集合失败:'+err);
				return cb(false);
			 } 
			 ary[po].timestamp = new Date();
			 ary[po].po = po;
			 collection.insert(ary[po], function(err, doc){	
					 release();
					 if (err){ 
						restlog.err('创建验证码插入数据失败'+err);
						return cb(false);
					 }
					var name = ary[po].value;
					delete ary[po].po;
					delete ary[po].timestamp;	
					ary.forEach(function(value, j){
						ary[j].url = '/piccaptcha?picid='+captcha.generate(ary[j].id);
						delete ary[j].value;
						delete ary[j].id;
					})
					cb({id:doc[0]._id, value:name, caary:ary});//返回给控制器回调函数的对象					
			});//insert
		});//collection
	});//mongo
	
}

captcha.contrast = function(id, po, cb){ //判断验证码
	var res = false;//预设值为false
	mongo(function(err, db, release){
		db.collection(captcha.dbcolname, function(err, collection){
			if (err) return release();
			collection.findOne({'_id':get_id(db, id)},function(err, doc){
				release();
				if(err) return restlog.err('对比验证码失败：'+err);
				if(doc && doc.po == po) res = true;	//如果对比成功，返回true，否则为false
				captcha.destory('', id);
				cb(res);
			});//findOne
		});//collection
	});//mongo
}

captcha.destory = function(timestamp, id){ //删除验证码
	var delc = {"timestamp":{"$lt":new Date(timestamp)}};
	mongo(function(err, db, release){
		if(err) return;
		if(typeof id !== 'undefined'){//如果传递了id进来则删除的条件为id
			delc = {"_id":get_id(db, id)};
		}
		db.collection(captcha.dbcolname, function(err, collection){
			 if (err) return release();
			 collection.remove(delc, function(err){
				release();
				if(err) restlog.err('摧毁验证码失败：'+err);
			 });//remove
	   });//collection
	});//mongo
}
captcha.getrandmon = function(ary, num){ //随机从数组中抽取num项记录作为验证码题目
	var se_ary = ary,
		ca_ary = [];
	for(var i=0; i<num; i++){
		var n = Math.floor(Math.random()*se_ary.length);
		ca_ary.push(se_ary.splice(n,1)[0])
	}
	var po = Math.floor(Math.random()*ca_ary.length);	
	return {"po":po, "ca_ary":ca_ary};
}

captcha.intial = function(){ //初始化，异步脚本删除验证码
	process.nextTick(function(){
		mongo(function(err, db, release){ //建立集合
			if (err) return release();
			db.createCollection(captcha.dbcolname, function(err, col){
			   release()
			   if(err) restlog.error('创建验证码集合失败：'+err)
			})
		});
		setInterval(function () {
		  var now = (new Date()).getTime()-1000*60*30;
		  captcha.destory(now);
		}, 1000*60*30);//每半小时清理一次验证码数据库，删除超时验证码数据
	});
}();
module.exports = captcha;
module.exports.captcha_ary = captcha_ary;


