/**
 * autoStatic.js 文件是自动响应静态文件模块
 * 主要作用是会根据是否开启parse整合css和js文件做出不同响应
 * 如果未开启 parse 功能，则根据get请求路径自动去 staticFolder 响应静态文件
 * 如果开启parse功能，并使用parse功能，请求的是js文件，则会利用ugliyf压缩合并以后响应
 * 如果开启parse功能，并使用parse功能，请求的是css文件，则会利用less编译，然后压缩合并响应
 * exports 根据情况输出响应函数
 */
var asyncProxy = require('./modules/AsyncProxy'),
    restUtils = require('./RestUtils'),
    fs = require('fs'),
    path = require('path'),
    less = require('less'),
    msg = require('./msg/msg'),
    outError = require('./Outerror'),
    normalize_query = restUtils.normalize_query,
    autoStatic = _restConfig.autoStatic,
    staticFolder = _restConfig.baseDir + _restConfig.staticFolder,
    staticParse = _restConfig.staticParse,
    staticParseName = _restConfig.staticParseName,
    staticParseCompress = _restConfig.staticParseCompress,
    staticParseCacheTime = _restConfig.staticParseCacheTime,
    staticParseMaxNumber = _restConfig.staticParseMaxNumber,
    staticParseCacheFolder = _restConfig.baseDir + _restConfig.staticParseCacheFolder,
    reg = new RegExp("^" + autoStatic + "/");

if (staticParseCompress) {
    var uglifyjs = require('uglify-js'),
        compressCss = require('./modules/compressCss'), //压缩CSS方法
        compressJs = function(str) {
            //使用uglify-js压缩，生成压缩后的js文件
            var pro = uglifyjs.uglify,
                ast = uglifyjs.parser.parse(str);
            ast = pro.ast_squeeze(pro.ast_mangle(ast));

            return pro.gen_code(ast) + ';';
        };
}

var staticObj = {
    parseStaticCache: {},
    // 自动响应静态文件
    autoStaticFn: function(req, res) {
        // 拼装静态文件绝对地址
        var filePath = staticFolder + '/' + req.path.slice(1).join('/');

        // 如果是css文件则去生成less.前缀的css文件名
        if (this.isLessType(filePath)) {
            // 生成编译后的less的css文件，返回err和csspath两个参数
            staticObj.genless(filePath, function(err, cssPath) { 
                if (err) {
                    return restUtils.errorRes(res, err.msg, err.scode);
                }
                res.sendfile(cssPath);
            });
        } else {
            res.sendfile(filePath);
        }
    },
    // 根据路径地址获取后缀名
    getMimeType: function(path) { 
        var po = path.lastIndexOf('.') + 1;
        return path.slice(po).toLowerCase();
    },
    isLessType: function(cssPath) {
        return cssPath && /\.less(?:\.css)?$/.test(cssPath);
    },
    /**
     * 生成编译后的less文件，即是在原来css文件加前缀less.
     */
    genless: function(filePath, callback) { 
        var fileArr = filePath.split('/'),
            fileDir = fileArr.slice(0, fileArr.length - 1).join('/');

        callback = callback || function() {},
        fs.readFile(filePath, 'utf-8', function(err, data) { //根据请求读取目录
            // 如果文件不存在，则callback(err)
            if (err) {
                return callback({
                    msg: msg.resmsg.notFound,
                    scode: 404
                }); 
            }
            // 开始编译less文件
            new(less.Parser)({
                paths: [fileDir] // Specify search paths for @import directives
            }).parse(data, function(err, css) { 
                //如果编译出错，则callback(err)
                if (err) {
                    return callback({
                        msg: msg.resmsg.lessError,
                        scode: 500
                    });
                }
                var po = filePath.lastIndexOf('/') + 1,
                    path = filePath.slice(po),
                    lessPath = filePath.replace(path, 'compile.' + path); //根据元有文件路径拼装成带less.为前缀的less css文件
                // 根据 lesspath 生成编译好的css文件
                fs.writeFile(lessPath, css.toCSS(), function(err) {
                    // 如果写入出错
                    if (err) {
                        return callback({
                            msg: msg.resmsg.lessWriteError,
                            scode: 500
                        });
                    }
                    //执行回调 传参 lesspath
                    callback(null, lessPath);
                })
            });
        })
    },
    parse: function(type, filePathArray, md5str, callback) {
        var as = asyncProxy(), //实例化异步代理库 AsyncProxy
            ary = [], //存放异步方法的数组	
            fileary = [], //存放buffer.toString()的css或js文档
            wrong = 0, //错误记录，大于0说明有错误
            genlessnum = filePathArray.length, //待生成less的文件数
            gencount = 0, //已经生成的less文件数
            readfile = function(value, index) {
                var value = value.replace(autoStatic, ''), //静态文件路径去掉前缀
                    staticPath = staticFolder + value, //文件的绝对路径
                    recfn = function(rec) {
                        fs.readFile(staticPath, 'utf-8', function(err, data) {
                            if (err) {
                                wrong++;
                            } else { //坑爹的uglify，末尾不加';'号而且有错还得用户加try，我去提意见
                                if (staticParseCompress) {
                                    try {
                                        fileary[index] = zipFn(data);
                                    } catch (e) {
                                        fileary[index] = data;
                                    }
                                } else {
                                    fileary[index] = data;
                                }
                            }
                            rec(); //异步库方法，表示此异步正常返回
                        });
                    };
                if (staticObj.isLessType(value)) {
                    staticObj.genless(staticPath, function(err, lesspath) {
                        if (err) return callback(err.msg);
                        staticPath = lesspath; //如果是css，则将 staticPath 修改为 lesspath
                        if (++gencount >= genlessnum) { //如果所有的css都生成完成
                            process.nextTick(function() {
                                as.ap.apply(as, ary); //开始合并css
                            })
                        }
                    });
                }
                return recfn; //返回 recfn 函数作为异步函数
            };
            allComplete = function() { //当所有异步的 recfn 都执行完毕后执行
                if (wrong > 0) {
                    return callback(msg.resmsg.parseNotExist); //如果有错误，则部分文件不存在
                }
                fs.writeFile(staticParseCacheFolder + '/' + md5str, fileary.join(''), 'utf-8', function(err) {
                    if (err) return callback(msg.resmsg.parseCreateCacheError); //如果生成缓存文件失败
                    callback(null, staticParseCacheFolder + '/' + md5str); //生成成功，将缓存路径返回给callback
                    as = null; //垃圾回收
                })
            };
        if (staticParseCompress) {
            var zipFn;
            type = type === 'less' ? 'css' : type;
            if (type === 'css') {
                zipFn = compressCss; //css 压缩模块
            } else if (type === 'js') {
                zipFn = compressJs; //js 压缩模块
            } else {
                return callback(msg.resmsg.parseTypeError);
            }
        }
        // 为每一个路径添加fs访问路径
        filePathArray.forEach(function(value, index) {
            // 如果访问路径不正确
            if (!reg.test(value)) {
                return wrong++;
            }
            var vtype = staticObj.getMimeType(value);
            // 如果后面的文件不是css也不是js
            if (vtype !== 'css' && vtype !== 'js' && vtype !== 'less') {
                return wrong++;
            }
            ary.push(readfile(value, index));
        });
        if (wrong > 0) {
            return callback(msg.resmsg.parseError);
        }
        ary.push(allComplete);
        if (!staticObj.isLessType(filePathArray[0])) {
            as.ap.apply(as, ary);
        }
        return true;
    },
    createCache: function(type, filePathArray, md5str, res) { //生成缓存的方法
        // 生成缓存以后的回调，如果有错误也会执行
        var callback = function(errmsg, filepath) {
            if (errmsg) {
                return restUtils.errorRes(res, errmsg); //如果生成缓存失败，则输出错误		
            }
            staticObj.parseStaticCache[md5str] = { //如果正常返回，则创建和更新缓存
                timestamp: Date.now(),
                filepath: filepath,
            }
            res.sendfile(filepath);
        };
        staticObj.parse(type, filePathArray, md5str, callback); //根据生成缓存文件函数返回的路径输出缓存				
    },
};

// 如果没有开启静态文件整合功能则直接自动输出静态文件
if (!staticParse) {
    module.exports = staticObj.autoStaticFn;
} else { // 开启静态文件整合压缩
    module.exports = function(req, res) {
        var parsePath = req.getparam[staticParseName];
        // 开启功能但未使用此方法，则直接自动输出，例如请求是图片或者txt
        if (!parsePath) {
            return staticObj.autoStaticFn(req, res);
        }
        var pathArr = parsePath.split('|');
        // 如果超长，则报错
        if (pathArr.length > staticParseMaxNumber) {
            return restUtils.errorRes(res, msg.resmsg.parseTooLong);
        }

        var type = staticObj.getMimeType(pathArr[0]),
            md5str = restUtils.md5(parsePath) + '.' + type, //生成md5字符串
            pobj = staticObj.parseStaticCache[md5str];

        pathArr.map(function(pathname) {
            return normalize_query(pathname);
        });
        // 如果有缓存，并且缓存未超时,正常输出缓存文件
        if (pobj && (Date.now() - staticParseCacheTime < pobj.timestamp)) { 
            var p = pobj.filepath;
            path.exists(p, function(exist) {
                if (exist) {
                    res.sendfile(p, function(err) {
                        if (err) {
                            outError(msg.parse(msg.errmsg.parseCacheNotFound + p, err));
                        }
                    });
                } else {
                    // 如果读取缓存失败，则去生成缓存
                    staticObj.createCache(type, pathArr, md5str, res);
                }
            });
        } else {
            // 去生成缓存
            staticObj.createCache(type, pathArr, md5str, res);
        }
    }
}
