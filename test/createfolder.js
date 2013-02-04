var should = require('should');
var path = require('path');
var fs = require('fs');




var conf = module.exports.rrestjsconfig = {
	listenPort:3000,
	autoCreateFolders:true,
	baseDir: path.join(__dirname+'/createfolder')};


if(!fs.existsSync(conf.baseDir)){
				fs.mkdirSync(conf.baseDir);	
}



var http = require('http'),
	rrest = require('../');
	server = http.createServer(function (req, res){
		res.send('hello wrold');
	}).listen(rrest.config.listenPort);



setTimeout(function(){

var folder = fs.readdirSync(__dirname+'/createfolder');
var folder2 = fs.readdirSync(__dirname+'/createfolder/tmp');

should.strictEqual(folder.sort().toString(), ["mylogs","modules","view","static","tmp"].sort().toString());
should.strictEqual(folder2.sort().toString(),["template","upload","static"].sort().toString());
console.log('create test done!');
process.exit();
},3000)