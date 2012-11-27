/*
	基本测试，手动路由 manual routrer 例子
*/
var should = require('should');
var request = require('request');
var path = require('path');

module.exports.rrestjsconfig = {
	listenPort:3000,
	baseDir: path.join(__dirname)
};
module.exports.rrestjsconfig_dev = {
	listenPort:4000,
	baseDir: path.join(__dirname)
};


var	rrest = require('../');


should.strictEqual(4000, rrest.config.listenPort);
console.log('devtest.js test done.');
process.exit();

