var should = require('should');
var path = require('path');
module.exports.rrestjsconfig = {
	listenPort:3000,
	autoCreateFolders:true,
	baseDir: path.join(__dirname+'/createfolder')};

var http = require('http'),
	rrest = require('../');
	server = http.createServer(rrest(function (req, res){
		res.send('hello wrold');
	})).listen(rrest.config.listenPort);


var fs = require('fs');
var folder = fs.readdirSync(__dirname+'/createfolder');
var folder2 = fs.readdirSync(__dirname+'/createfolder/tmp');

should.strictEqual(folder.toString(), "mylogs,modules,view,static,tmp");
should.strictEqual(folder2.toString(),"template,upload,static");
console.log('create test done!');
process.exit();
