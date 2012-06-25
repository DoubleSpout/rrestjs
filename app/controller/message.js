var home = {},
	fs = require('fs'),
	pagenum = 20,//首页发送20条数据
	fdate = _rrest.mod.stools.fdate,//实用工具模块
	htmltostring = _rrest.mod.stools.htmltostring,//字符串转html
	check_all_param = _rrest.mod.stools.check_all_param,//检查所有参数是否存在
	checkemail = _rrest.mod.stools.checkemail,
	addstar = _rrest.mod.stools.addstar,
	AsyncProxy = _rrest.AsyncProxy,//异步代理库
	ca = require('../modules/captcha'),//验证码模块
	gr = _rrest.mod.gravatar,//gravatar模块
	mongo = _rrest.mongo,//连接mongo数据库方法
	get_id = _rrest.mod.stools.get_id,//mongodb的_id生成方法
	title = _rrest.config.webtitle;

function getmsg(sname, condition, pagenum, callback){ //获取数据
	
	mongo(function(err, db, release){
		if(err) return;
		db.collection("msg", function(err, col){
			if(err) return release();
			var sortc = {"sort":[['_id','desc']], "limit": pagenum},//每次发送多少个
				findc = sname === true? {} : (function(){//创建查找作者的正则
					var reg=new RegExp(sname,'i');
					return {"name":reg}})();
			if(condition != true) findc._id = {"$lt":get_id(db, condition)};
			findc.pid = 0;
			var   cursor = col.find(findc,sortc);//获得查询条件游标
			cursor.count(function(err, total){
				var total = total||0;//总数
				cursor.toArray(function(err, results){
						var msgarray = results||[],//获取全部条件的内容
							len = msgarray.length;//本次获取的长度
						if(len == 0){
							release();
							return callback(err, msgarray, total);						
						}
						var ap = new AsyncProxy(true),
							apfunc = [],//异步操作函数数组
							apall = function(){//异步操作执行完毕函数
								//restlog.info('数据获取完毕');
								release();//释放链接
								ap=null;
								return callback(err, msgarray, total);
							};
						msgarray.forEach(function(value, index){
							 var func = function(rec){//根据msgarray数组查找回复
										col.find({"pid":value._id+''}).toArray(function(err, results){
											//restlog.info(order);
											//restlog.info(results)
											var n = msgarray[index].name
											msgarray[index].name = addstar(n);
											results.forEach(function(value, i){
												var m = results[i].name;
												results[i].name = addstar(m);
											})
											msgarray[index].reply = results
											rec();
										})
									}
							  apfunc.push(func);//放入异步数组
						});
						apfunc.push(apall);//放入总方法
						var t = ap.ap.apply(ap, apfunc);
						//restlog.info("共有多少次异步操作："+t)
					})//toarray方法
				})//count
			})//collection
		})//mongo
}


home.initial = function(){ //初始化
	mongo(function(err, db, release){
		if(err) return;
		db.createCollection("msg", function(err, col){
			if(err) return release();
			col.ensureIndex({"pid":-1}, function(err, r){ //这里建立一个根据plus点数排序的索引
				if(err){
					release();
					return restlog.error('索引建立失败：'+err);
				}
				col.indexInformation(function(err,array){
					   if(!err) restlog.info('当前msg集合所有索引为：'+JSON.stringify(array))
					   release();
				});
			})
		});
	});
}();

home.index = function(req, res){
	var sname = req.getparam['sname'] || true,
		email = req.session.email || '';
	if(!sname){sname = htmltostring(sname);}
	getmsg(sname, true, pagenum, function(err, msgarray, total){
		if(!err) res.render('/message.jade', {pagetitle:_rrest.config.webtitle+'-留言板', h1class:'h1_p', msg:msgarray, total:total, email:email});
	})
}


home.more = function(req, res, pathobj){//获得更多接口
	var sname = htmltostring(req.getparam['sname']),//查询用户名
		condition = req.getparam['condition'],//最后一个_id用于快速分页
		pagenum = req.getparam['pagenum'],//拿多少个数据
		pageint = parseInt(pagenum);
	sname = sname == 'true' ? true:sname;
	if(!check_all_param(condition, pagenum)){
			return res.sendjson({"suc":0,"fail":"获取更多信息参数错误"});
		}//参数错误
	if(sname == '' || typeof sname === 'undefined'){
			return res.sendjson({"suc":0,"fail":"作者名错误"});
		};//查询用户名
	if(condition.length != 24){
		return res.sendjson({"suc":0,"fail":"condition参数错误1"});
	}
	if(pageint != pagenum && pageint>100){//防止恶意获取大于100条的数据，查爆服务器内存和数据库
		return res.sendjson({"suc":0,"fail":"pagenum参数错误"});
	}
	getmsg(sname, condition, pageint, function(err, msgarray, total){
		if(err){
			res.sendjson({"suc":0,"fail":"获取失败1"});
			restlog.error('getmore错误：'+err);
		}
		else{
			res.compiletemp('/include/msg.jade', {msg:msgarray}, function(err, data){
				if(err) return res.sendjson({"suc":0,"fail":"获取失败2"});
				res.sendjson({"suc":1,"content":data});
			});
		} 
	})
}


home.getcaptcha = function(req, res){//获取验证码
	var ac = req.getparam['a'];
	if(!check_all_param(ac)){
		  return res.sendjson({"suc":0,"fail":"获取验证码参数错误"});
		}
	if(ac != 'getcap'){
		  return res.sendjson({"suc":0,"fail":"获取验证码action错误"})
		}
	var sendca = function(caobj){//生成验证码的回调
		if(!caobj) return res.sendjson({"suc":0,"fail":"验证码获取失败"});
		res.sendjson({"suc":1, "data":caobj});//发送验证码
	}
	ca.creat(sendca);//生成验证码
}

home.send = function(req, res){
	var name = req.getparam['name'],//用户名
		content = req.getparam['content'],//内容
		pid = req.getparam['pid'],//是否为回复
		po = req.getparam['po'],//验证码选择位置
		poid = req.getparam['poid'];//验证码id
	if(!check_all_param(name, content, pid, po, poid)){
			return res.sendjson({"suc":0,"fail":"send参数错误"});
		}//这些参数都必须存在
	if(parseInt(po) != po || parseInt(po)<0 || parseInt(po)>(ca.canum-1)){
			return res.sendjson({"suc":0,"fail":"位置错误"});
		}//用户拖拽的图片位置参数错误
	if(poid.length !== 24){
			return res.sendjson({"suc":0,"fail":"验证码ID错误"});
		}
	if(!checkemail(name) || name.length>50){
			return res.sendjson({"suc":0,"fail":"用户名过长或不为邮箱"});
		}
	if(content.length>150){
			return res.sendjson({"suc":0,"fail":"内容过长"});
		}
	req.session.email = name;//将用户传入的name值设置session，方便用户重复输入
	var sendc = function(ca_bool){//对比完验证码执行
		if(!pid || pid.length !== 24){pid=0;}
		if(!ca_bool){
			return res.sendjson({"suc":0,"fail":"验证码失败，你是非人类！"});
		}
		var data = {
			name : htmltostring(name),
			content : htmltostring(content),
			time : fdate('y-m-d h:m:s'),
			plus:0,
			pid:pid,
			ip:req.ip,
		};
		mongo(function(err, db, release){//操作mongodb数据库
			if(err) return;
			db.collection("msg", function(err, col){
				if(err) return release();
				col.insert(data, function(err, record){
					if(err){
						release();
						restlog.error('提交留言失败：'+err);
						return res.sendjson({"suc":0, "fail":"提交失败"});
					}
					res.sendjson({"suc":1});
					gr(data.name, function(err, url){//生成gravatar头像
						if(err){
							release();
							return restlog.info('gravatar头像获取失败：'+err);

						}
						var url = url || '';
						col.update({"_id":record[0]._id}, {"$set": {"gr":url}}, function(err){
							if(err) restlog.info('gravatar头像更新失败：'+err);
							release();
						});//update
					});//gr.create
				});//insert
			});//collection
		});//mongo
	}
	ca.contrast(poid, po, sendc);//去验证验证码
} 


home.del = function(req, res){//执行删除操作
	var id = req.getparam['id'];
	var pwd = req.getparam['pwd'];
	if(id.length !== 24){
		return res.sendjson({"suc":0,"fail":"id无效"});
	}
	if(pwd !== 'spout2009'){//这里应该有后台，这里为了简便
		return res.sendjson({"suc":0,"fail":"对不起，您没有权限"});
	} 
	//判断合法性id的合法性和用户是否有权力

	mongo(function(err, db, release){//操作mongodb数据库
		if(err) return;
		db.collection("msg", function(err, col){
			if(err) return release();
			col.remove({$or:[{_id:get_id(db, id)}, {pid:id}]},function(err, r){//删除id并且将回复一并删除
				release();
				if(err){
					restlog.error('删除失败，id为：'+id+'失败原因：'+err);
					res.sendjson({"suc":0,"fail":"操作失败"});
				}
				else res.sendjson({"suc":1});				
			})//remove
		});//collcetion
	});//mongo
} 

module.exports = home; 




