/*
	测试config的读取
*/

var should = require('should');
var path = require('path');
var rrestconfig = module.exports.rrestjsconfig = require('../config/default_config.js');
var rrest = require('../');

should.strictEqual(rrest.config, rrestconfig);
console.log('config.js test done!');
process.exit();








