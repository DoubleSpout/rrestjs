//自动加载目录测试
var path = require('path');
var should = require('should');
module.exports.conf = {
		baseDir: path.join(__dirname, '/../'),
		AutoRequire:true, //是否开启模块自动加载，加载只有的模块可以使用  rrest.mod.模块名 来进行调用
		ModulesExcept:['captcha'], //自动加载模块目录中例外不加载的模块
};
var	http = require('http'),
	rrest = require('../'),
	mod = rrest.mod;

should.strictEqual(mod.stools, require('../modules/stools.js'));
should.strictEqual(typeof mod.captcha, 'undefined');
console.log('autorequire test done!');
process.exit();



