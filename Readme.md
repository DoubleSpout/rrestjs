[![Build Status](https://secure.travis-ci.org/DoubleSpout/rrestjs.png?branch=master)](http://travis-ci.org/DoubleSpout/rrestjs)


# rrestjs —— HIgh performance node.js ROA  RESTFUL  web framework

  已经全面支持node v0.8.3版本，请放心使用	  

  rrestjs是一款基于expressjs代码开发的高性能node.js开发框架，由于重新编写了框架组织架构，比expressjs整体性能提升大约10%，实用功能也更加丰富，API和代码风格相比expressjs更简单易懂。

  rrestjs简单工作流程如下： 
  
  1、例如用户请求 /user/face/?uid=10086

  2、rrestjs接收请求，然后对req以及res等进行简单封装，然后接由用户处理

  3、用户根据请求路径，找到user.js文件，然后执行其中的face方法，根据请求的method和uid，用户可以自由的响应不同的内容

##项目演示网址：http://www.rrestjs.com

  利用rrestjs框架搭建的一个基于mongodb和nodejs的个人小站，有jade模版输出和留言板的小应用，代码在本例 app 文件夹中。

##案例演示网址：http://www.wujb.net
   
   wujb.net是一个基于rrestjs框架开发的，node.js和mongodb搭建的个人博客小站，有好友，私信，喜欢等功能

##新手入门教程
 
  手把手教程： http://snoopyxdy.blog.163.com/blog/static/60117440201211743031517/

##安装方法：

  目前没有对windows环境下做任何测试和支持，请使用linux系统

  1、npm install -g rrestjs,如果node_modules不能正常下载执行 npm update rrestjs（如果node_modules还是不能正常打包或者有任何错误，请手动下载本例中的node_modules文件夹）

  2、直接从github上打包下载  

##框架介绍：目前是0.8.0版本，unstable版本，近期推出v1.0版本，包括大量的test测试代码
 
  社区文章： http://club.cnodejs.org/topic/4f16442ccae1f4aa27001039

  博客： http://snoopyxdy.blog.163.com/blog/static/60117440201201344425304/

  v0.2升级博客: http://snoopyxdy.blog.163.com/blog/static/601174402012113104618863/

  v0.4升级博客： http://snoopyxdy.blog.163.com/blog/static/60117440201211643738703/
  
  v0.5升级博客(新增支持ejs模版)：http://snoopyxdy.blog.163.com/blog/static/6011744020121214533543/

  v0.6升级博客(新增支持less)：http://snoopyxdy.blog.163.com/blog/static/60117440201221514687/

  v0.7升级博客(新增局部配置功能)：http://snoopyxdy.blog.163.com/blog/static/6011744020125733812506/

  v0.8升级博客(修复bug和新增不少功能)：http://snoopyxdy.blog.163.com/blog/static/60117440201286300974/
	
  v0.9升级博客(修复bug，增加手动路由功能)：http://snoopyxdy.blog.163.com/blog/static/60117440201291025549630/

##性能测试：

  性能测试地址，对比node.js, expressjs和rrestjs: http://snoopyxdy.blog.163.com/blog/static/6011744020120135424340/

  rrestjs和expressjs功能对比: http://snoopyxdy.blog.163.com/blog/static/60117440201201344425304/

##简单的代码风格：一个hello world的例子


      module.exports.conf = require('./config/config');

      //加载rrestjs配置文件，这里的 conf 属性 可以是以下任意一种：

      //'config', '_config', 'conf', '_conf', 'rrestjsconfig', 'rrestconfig',  '_rrestjsconfig', '_rrestconfig', 'appconfig', '_appconfig'

      var http = require('http'),    

      rrest = require('rrestjs'),

      server = http.createServer(function (req, res) {

		res.send('hello world');

	}).listen(rrest.config.listenPort);



##开发建议：

  在1.2.4版本，rrestjs框架重新改写了部分全局变量，保留使用了 global.restlog、global.rrest、global._restConfig 这三个全局变量，请注意

  可以利用打包下载的文件目录直接开发，也可以像express那样自己建立搭建文件夹进行开发，唯一需要注意的是 module.exports.conf = require('./config/config'); 加载配置文件语句需要放在 require('rrestjs'); 之前。

  由于抛弃了路由映射表，所以在入口处需要根据用户请求的url来分配到指定控制器中，下面是一个简单的npm安装rrestjs搭建应用入口的代码例子：


	module.exports.conf = require('./config/config');//加载配置文件，必须放在rrestjs加载之前，配置文件格式详见 https://github.com/DoubleSpout/rrestjs/blob/master/config/example_config.js
	
	var http = require('http'),
	 
	    rrest = require('rrestjs'),

	    server = http.createServer(function (req, res){//这里是主入口，可以根据您的需要自由添加一些东西，而express并没有对用户开放主入口

		try{

			require('./controller/'+req.path[0])[req.path[1]](req, res);//这里是核心部分，执行指定控制器中的方法，将req和res传参进去

		}

		catch(err){
		
			restlog.info(err);//日志方法，例如 restlog.error('错误msg');有error，info，等多种等级，详见下面api

			res.statusCode = 404;

			res.render('/e404.jade' ,{errorpath: '/'+req.path.join('/')});

		}

	    }).listen(rrest.config.listenPort);//监听配置文件的设置的端口，如果要修改或者读取配置文件的内容，请用 rrest.config;

          rrest = rrest; //升级rrest为全局变量

	  pool = rrest.mongo;//mongodb连接池的方法，例如：rrest.mongo(function(err, db, release){ dosomething... 然后 将连接交还连接池执行 release() }, [dbname]); 详见下面api


##config
 
  config是rrestjs最重要的文件，它是让rrestjs正常启动必不可少的文件。您只需要在您第一次 require('rrestjs') 前加上代码： module.exports.conf = require(您config文件存放地址)  即可，当然您也可以任意在您的config文件中加入配置常量，具体config格式请参阅下面连接。
  
  require('rrestjs').config：获取config文件内容

  config配置详细说明地址：https://github.com/DoubleSpout/rrestjs/blob/master/config/default_config.js


##开发模式-d或--dev参数
 
  进入开发者模式，只需要 node app.js -d 或者 node app.js -dev，用来进入，还可以根据开发者模式加载开发配置文件，比如：module.exports.conf_dev，这样就加载了开发模式下的配置文件了。

  只需要在原有的conf或者config等变量名后加“_dev”，rrestjs会自动的去获取此dev配置文件

  比如：
  
  module.exports.conf = require('./config/post.conf.js'); //用于发布的生产环境
 
  module.exports.conf_dev = require('./config/post.conf_dev.js'); //用于开发的开发环境

  如果进入了开发模式没有找到相关的config文件，则使用默认配置


##baseDir

  rrestjs所有的配置目录都是相对于baseDir的相对目录，baseDir的设置通常分为3种：注意除 baseDir 其他路径的配置都需要加上前缀'/'
  
  1、baseDir: path.join(__dirname, '/..') //根据config文件的相对目录取绝对地址

  2、baseDir: path.dirname(process.argv[1]) //根据node启动命令取相对目录地址

  3、baseDir： '/usr/local/nodejs/rrestApp' //直接设定绝对目录

##如何正确运行example

  example中的例子均在本人机器上测试通过，linux 2.6.8 64bit / node.js v0.6.6 / mongodb v2.0，对于windows下并没有测试过，请见谅。 

  并且由于部分示例需要调整 /config/example_config.js 文件夹中的内容或者依赖mongodb，所以想要正常运行部分示例需要先安装 mongodb v2.0 及以上，然后可能需要手动去修改config配置内容来运行它

  直接生成项目文件夹： rrestjs -p /tmp/foo && cd /tmp/foo;

  也可以使用开发者模式，带自动重启（windows下无效）   rrestjs -p /tmp/foo -d && cd /tmp/foo;

##API

  说明：[]内表示可选参数，但是必须根据顺序传递，如果是fn([arg1], [arg2])，表示arg1或者arg2都是可选参数，并且无需根据顺序
  
  api属性和方法都为小写, 加上"()"的为方法，没有的是属性，还有一些特有功能的使用帮助和示例

##Request: request对象，是IncomingMessage的一个实例;
  
  Request.path: 拆分过后的uri数组,例如访问/user/face/spout, 则拆分成: ['user', 'face', 'spout'], 如果访问'/'则拆分成['index', 'index'], 会自动补足2位;

  Request.ip: 客户端访问IP地址，例如:127.0.0.1;

  Request.referer/Request.referrer: 客户端的来源, 例如用户是从谷歌搜索而来，则Request.referrer为: http://www.google.cn;

  Request.useragent: 客户端浏览器信息, 可以从中捕获IPAD或IPHONE用户等等;
  
  Request.getparam: 客户端请求get参数的对象, 比如客户端通过get请求发送了一个name=spout, 获取方法为: Request.getparam.name; //spout
  
  Request.queryparam: 无关http请求的方法，获取url上的参数

  Request.bodyparam: 无关http请求的方法，获取请求body里的内容

  Request.postparam: 客户端请求的post参数对象,获取方法同上，如果是上传文件的，这里不能获取;
  
  Request.putparam: 客户端请求的put参数对象,获取方法同上，如果是上传文件的，这里不能获取;

  Request.file: 客户端上传的文件对象, 包括size, name, type, path等属性，比如客户端上传了一个头像文本框name值为face, 获取方法为: Request.file.face; //{size:1024, name:'face.gif', path:'/tmp/xxxxxx', type:'image/gif', ...}

  Request.cookie: 获取客户端http请求头中的cookie对象, 获取cookie名为name, 值为spout的cookie方法为: Request.cookie.name; //spout

  Request.session: 根据sessionid, 获得客户端保存在服务端的session对象，如果没有则会自动创建session对象, 设置session值的方法为: Request.session.name = 'spout', 具体session的一些配置可去config详细配置;
 
  Request.delsession():摧毁session方法, 摧毁当前的sessionid;

  Request.isxhr:根据是否为ajax的请求返回布尔值

  Request.param 会将所有客户端发送过来的参数，不论get或者post等的参数放入这个对象。如果出现重名则file>post>get

  Request.apibody 如果是做webapi打算支持json或者xml数据格式提交，则会根据put或者post上来的请求头里的content-type来判断使用何种解析器解析request的body，目前支持xml和json

  Request._body 对于支持webapi的json或者xml数据提交过来的原始字符串，可供用户自行使用

##Response: response对象，是ServerResponse的一个实例
   
  Response.cache(type, maxAge): 设置请求缓存头，让浏览器对此uri请求缓存,type: public, private等, maxAge: 缓存的时间,单位毫秒; 如果想清除缓存，不响应304，则可以使用res.cache(false)或者res.cache('public', -1)

  Response.send(body, [statscode, iszlib, issession]): 响应客户端的请求, body: buffer或者string响应主体. statscode: 请求状态码, 默认200. iszlib: 此次响应是否开启deflate或gzip, 默认:true. issession: 本次响应是否输出cookie更新session, 默认:true;

  Response.sendjson(object, [statscode, iszlib, issession]): 用法同上，只是这里的javascript对象会转换成JSON字符串输出;

  Response.sendjsonp(content, [statscode, iszlib, issession]): 如果客户端是jsonp跨域请求, 且回调函数放在get参数callback=functionname中, 则只需将计算后的结果content传入此方法，会自动响应 functionname(content);

  Response.sendfile(filepath, [callback]): 输出文件给客户端, filepath文件存放绝对地址, callback完成后回调，两个参数err, filebuffer;(注: ranges未经严格测试)

  Response.file(filepath, [callback]):输出文件给客户端, filepath文件存放相对于 baseDir(应用目录) 的绝对地址, callback完成后回调，两个参数err, filebuffer;(注: ranges未经严格测试)

  Response.download(filepath, [callback]): 功能同上，这里会加一个下载的http响应头

  Response.r404([filepath], [callback]):输出404页面，如果不传参数，则会默认去读取baseDir下的404.html文件（utf-8哦，亲），如果文件不存在，则读取默认，否则会根据filepath读取404页面并输出（只支持静态文件），fn为回调接收2个参数err, 404页面string。
  
  Response.clearcookie(name): 清除指定名称的cookie值 

  Response.cookie(name, val, [options]): 设置客户端cookie, 名/值, options:{maxAge:过期时间(毫秒), path:'/', httpOnly:true, domain:域名, secure:false(https上传输)};(注: 这里修正了expressjs的一个bug, 如需设置多个cookie, 多次调用此方法)

  Response.cookiep3p(): 设置cookieP3P头(注:未经严格测试);

  Response.redirect(url, [statuscode]): 跳转到指定的url地址, 少用此功能;statuscode有3种，301永久跳转，302临时跳转，303资源移动，当url为"back"时，自动根据referr来调回，如果没有，则跳转到网站更目录'/'

  Response.render(template, [pageNumber, options, callback]):目前仅支持jade和ejs模版，ejs和jade输出API相同，输出jade模版, template:'模版相对config设置中模版地址的地址', 比如模版地址设置为:'/temp/jade', 则输出'/user/index.jade'就相当于输出了'/temp/jade/user/index.jade', options: 传入jade模版的对象, callback: 模版输出回调两个参数err, jadestring, pageNumber的作用是分页缓存，将页面或其他唯一标识发送给模版，让其生成不同缓存，解决不同分页显示同一模版的bug,
        
	Response.render用法：
        
	Response.render(template) 不传参无回调，
       
	Response.render(template, options) 传参无回调，
        
	Response.render(template, callback) 传参有回调，
        
	Response.render(template, options, callback) 传参有回调无分页，
        
	Response.render(template, pageNumber, options) 传参无回调有分页，
        
	Response.render(template, pageNumber, options, callback) 全部参数，
        
	注：此方法当出错时自动响应err页面
  
  Response.compiletemp(template, [pageNumber, options, callback]):用法同Response.render，只是这个方法callback返回(err, htmlString)，只返回编译过后的html字符串，无论出错err与否都不会自动响应客户端的请求，

  Response.api(object): 此方法用来返回webapi的接口，如果请求头含有accept application/json的，则返回json字符串，如果含有application/xml，则返回xml字符串

##0.9版本新增手动路由（类似expressjs）

  用户可以再config.js新增这样的设置：{}花括号内的为变量占位，表示此段url为可变参数


      manualRouter:{
        
	"get:/user/face":function(req, res){res.send('change face')},
        
	"post:put:/user/info":function(req, res){res.send('get not access!')},

	"post:put:/user/info/{userid}":function(req, res){res.send('get user id!')},
        
	"/user/all":function(req, res){
       
	    if(!req.session.count) req.session.count = 0
            
	     res.send('all can access!'+(req.session.count++));
         
	  },

       }

     
  设置规则：method:method:url

  注意：url必须是“/”开头的。
  
  如果不加method则表示该 url 接受任何方式的 http 请求
     


##proxy反向代理和http代理功能
 
  rrestjs默认加载 node-http-proxy 用来让node做代理服务器，完全无缝贴合，这也和rrestjs坚持使用原生的node.js的API有关

  require('rrestjs').proxy = require('http-proxy');我们只需要使用  require('rrestjs').proxy 即可使用 http-proxy 所有功能
  
  具体api使用方法见：https://github.com/nodejitsu/node-http-proxy

##tploption: rrestjs模版的默认传参对象

  require('rrestjs').tploption 所有res.render()方法中都会传递给模版这个对象，如果有重复则以render方法的为准，但不会覆盖全局的tploption。

  例如 require('rrestjs').tploption.name = '123';//定义全局的模版变量

  也可以 require('rrestjs').tploption.name = function(req, res){return req.session.username;}; //函数接受req，res两个参数，并且return值输出给模版


##csrf防御

  默认如果开启session，则会在模版编译输出时在<form>表单中默认添加<input name="_csrf" />，并且在session中也会添加session._csrf，开发者可以根据比对这2者是否匹配来确定是否合法。

##AutoRequire: 自动加载 /modules 文件夹中的模块, 可以在config配置文件中详细配置开启或者例外

  require('rrestjs').mod['文件名']: 文件名会自动将后缀.js去掉, 例如在modules/as.js模块自动加载进来, 使用方法:  require('rrestjs').mod['as'];
  
##MongdbConnect: Mongodb数据库连接,可在config配置文件中详细配置, 比如: 连接数, 连接端口等等

  ps：如果您是使用nae的话，需要将config如下设置：
        
        MongodbConnectString:'mongo://r64rbc7amkny1:a16275kaxau@127.0.0.1:20088/nYSeIX8aUOnb',//在nae提供的字符串前加上mongo://

        MongodbDefaultDbName:'nYSeIX8aUOnb',//nae提供的数据库名

  require('rrestjs').mongo(callback, [dbname]): callback三个参数:err, db, release方法, err表示错误, db是Mongodb数据库实例, release()方法执行表示归还连接到连接池, 操作完数据库一定要执行release(); 出错err会自动归还
  
  require('rrestjs').mongo 代码运用示例：

        下面是一段删除留言及其回复的mongodb数据库操作代码

      	mongo(function(err, db, release, genid){//操作mongodb数据库

		if(err) return;//注意:这里只需return，如果有err，rrestjs会自动执行release()，归还连接至连接池!
		
		db.collection("msg", function(err, col){
			
			if(err) return release();//注意：如果出错，这里需要您手动执行release()，归还连接至连接池!
			
			col.remove({$or:[{_id:genid(id)}, {pid:id}]},function(err, r){//删除id并且将回复一并删除,genid生成object的_id
				
				release();//操作完毕执行归还连接
				
				if(err){
					
					restlog.error('删除失败，id为：'+id+'失败原因：'+err);//失败记录日志
					
					res.sendjson({"suc":0,"fail":"操作失败"});//失败响应失败
				
				}
				
				else res.sendjson({"suc":1});				
			
			})//remove
		
		});//collcetion
	
	});//mongo

  
  require('rrestjs').mpool(callback, [priority ]): genricpool方法, acquire.mpool(callback, priority )表示去连接池中获取一个连接,priority 表示优先级, callback接收2个参数err, db;无论err与否, 都需要mpool.release(db); 归还连接到连接池。建议使用上面的mongo方法。
  
##clientpipe模块，v0.9.0新增模块打通了前后端，使后端的一些模块可以供前端直接调用

  require('rrestjs').clientpipe就可以访问这个功能了，rrest.clientpipe 利用socket.io 和 now.js 组合封装而成。

  使用方法：后端利用 require('rrestjs').clientpipe.addsyn 和 require('rrestjs').clientpipe.addasy 同步和异步注册方法。

  当然目前默认提供一些方法，比如fileread，可以让客户端直接读取服务端的文件，request让客户端跨域发送各种请求，包括post也可以自定http头，和使用node.js的httprequest模块一模一样。
  
     clientpipe.addsyn('md5', function(str){//后端注册一个同步md5的方法

	   var crypto = require('crypto');

	   var shasum = crypto.createHash('md5');

	   shasum.update(str);

	   return shasum.digest('hex');

     });

     
     clientpipe.addasy('get', function(url, asyback){//注册一个异步的get方法

		var http=require('http');

			http.get(url, function(res){

				var body = '';

				res.on('data', function (chunk) {

					 body += chunk;

				 });

				 res.on('end', function(){

					asyback(null, {headers:res.headers, statusCode:res.statusCode, data:body});
				 });

			}).on('error', function(e) {

				asyback('get request error');

		});

	});


  而我们在客户端只需要如下代码即可跨域请求和生成md5字符串
  
            <script src="/static/rrestpipe.js"></script>//加载客户端的rrestpipe.js

	    rrestpipe.ready(function(){//当rrestpipe准备完毕
	    
		rrestpipe.pipe("md5", "abcd", function(err, md5str){
		
			alert(md5str);
		
		})	   
	    
		rrestpipe.pipe("get", "http://www.nodejs.org", function(err, res){
		
			alert(res.data);//这里返回的是对象
		
		})
	    
	    });


##restlog: 全局变量, 日志对象详细配置, 例如是否开启, 如何分级, 如何切分可在config文件中详细配置

  restlog.info(errmsg): 等级info日志, 测试用, 生产环境建议开启error等级

  restlog.warn(errmsg): 等级warn, 测试用, 生产环境建议开启error等级

  restlog.error(errmsg): 等级error, 生产环境用

##AutoStatic

  AutoStatic:自动响应静态文件, 需要去config配置, 例如: 将staticFolder设置为:'/app/static/skin', 将autoStatic设置为:'skin', 则用户只需要将图片src设置为 '/skin/face/spout.png' 即可自动响应此图片文件

  staticParse:css和js文件压缩整合自动响应，例如：'/static/?parse=/static/index.body.css|/static/index.user.css|/static/user.face.css' 表示压缩整合一个css响应给客户端，js同理

##AutoCreateFolders

  autoCreateFolders:自动创建文件目录，会根据config配置文件的临时目录地址自动创建目录

##IPtables

  IP过滤访问，可以根据配置进行白名单或者黑名单的切换IP过滤，路径过滤只能在白名单中使用。


  	IPfirewall:false, //是否开启IP过滤，开启会影响性能。

	BlackList:false,//如果是true，表示下面这些是黑名单，如果是false，表示下面这些是白名单，路径设置优先级大于IP

	ExceptIP:/^10.1.49.224$/, //正则表达式，匹配成功表示此IP可以正常访问,白名单

	ExceptPath:['/user'],//例外的路径，如果用户访问这个路径，无论在不在ip过滤列表中，都可以正常使用，白名单才能使用

	NotAllow:'No permission!', //禁止访问响应给客户端的信息

##ClusterPlus心跳以及内存监控

  如果将config文件中的Heartbeat和ClusterMaxMemory设置成相应的数值，则会开启心跳和内存监控功能，当主进程失去对子进程的心跳超过3次，自动重启子进程。

  当子进程内存超过指定数量时，自动重启子进程，所以这个值建议不要设置过低。

##ClusterPlus
 
  ClusterPlus是rrestjs内置的一个多进程多任务管理模块, 主要为rrestjs提供多进程多任务, 主进程自动唤醒意外挂掉的子进程, 同步内存session以及开发模式下的保存自动重启，让您想开发PHP那样方便的进行node.js开发.

  require('rrestjs').listen(server, [port||portarray])：让rrestjs来监听端口，如果您想让多个node.js进程监听多个不同端口，只需将server实例和[3000, 3001, 3002 ..]这样的端口数组传入此方法，如果不传参数，则默认第二个参数是config文件的 listenPort 属性。

  require('rrestjs').child.id：一个从0开始的整数，当开启Cluster后，每一个node.js子进程会具有这个属性。
  
  可以在配置文件config中详细配置ClusterPlus的各项功能：


  	isCluster:true, //是否开启多进程集群

	isClusterAdmin:true,//进程监听管理功能是否开启

	CLusterLog:false,//是否打开cluster自带的控制台信息，生产环境建议关闭

	adminListenPort:20910,//管理员监听端口号，主进程会自动监听此端口号

	adminAuthorIp:/^10.1.49.223$/,//允许访问管理的IP地址

	ClusterNum:4, //开启的进程数

	ClusterReload:'/example',//当 ClusterNum 进程数为1时，自动进入开发模式，可以监听此文件夹下的改动，包括子文件夹，开发时不用重复 ctrl+c 和 上键+enter		

  
  以下是开启 config.ClusterNum(假设4个) 个进程监听4个端口的代码:

	
	module.exports.conf = require('./config/config');//说明同上

        var http = require('http'),

	    rrest = require('rrestjs'),

	    port = [3000, 3001, 3002, 3003],

	    server = http.createServer(function (req, res){

			res.send('process '+rrest.id+' is listen at '+port[rrest.id]+' : hello world everyone!');

	    });

	rrest.listen(server, port);//这里如果不传port参数，则自动去读config.listenPort;

 
  以下是开启 config.ClusterNum 个进程监听1个端口的代码:(当 ClusterNum 为 1时，进入开发模式，根据配置的文件夹将自动重启node.js进程像PHP那样开发node.js应用)

	
	module.exports.conf = require('./config/config');//说明同上
	
	var http = require('http'),

	    rrest = require('rrestjs'),

	    server = http.createServer(function (req, res){

		res.send('process '+rrest.id+' is listen at '+port[rrest.id]+' : hello world everyone!');

	    }).listen(rrest.config.listenPort);//读取配置文件的监听端口号，必须这么写，只需修改配置文件即可轻松部署
  
  
##AsyncProxy

  AsyncProxy是一个异步代理的模块, 利用事件监听机制，并发异步处理并最终汇总处理的模块, 同时也支持异步依次处理的链式调用。

  下面是一个不定个数的异步处理的例子:
  
     
      var as = new require('rrestjs').AsyncProxy(), //其他代码相同，如果这里 new AsyncProxy(true), 则表示链式调用, 异步处理将依次执行, as.prev对象将能得到上一次异步处理的data数据

      asarray=[], //存放异步的方法

      dataall=[],//存放异步回来的数据

      asfunc = function(rec){
      
              异步处理函数(function(){//这个是异步函数的回调函数
		
		处理data;//异步处理data

		var state =  rec();// 将order告诉AsyncProxy表示已经此异步处理已经返回,  这里还将返回一个state对象, state: {rec: 已经返回异步数, total: 总需要返回异步处理数目}

	      }); 
      
      },

      asall = function(){ 
      
      汇总处理(dataall);
      
      as=null;//垃圾回收一下
      
      },

      len = array.length; //注这里的array就是异步处理需要的内容
  
      while(len--){
  
          asarray.push(asfunc(array[len])); //依次将异步处理函数放入异步处理数组中
  
      }
  
      asarray.push(asall); //将最终汇总函数存入数组

      var total = as.ap.apply(as, asarray);//as.ap方法是入口，参数规则  异步函数1, 异步函数2 ... 回调函数, 这里利用apply调用参数不定长的as.ap方法，此方法将返回一个inter型的total, 表示总共需要返回total个异步处理。


## 授权协议

基于MIT协议发布：

```
Copyright (c) 2012 Wu zhonghua(吴中骅) <snoopyxdy@gmail.com>
http://www.rrestjs.com

The MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```