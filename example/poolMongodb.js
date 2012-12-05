module.exports.rrestconfig = require('./config/dbsession.conf.js');
var http = require('http'),
	rrest = require('../'),
    server = http.createServer(function (req, res){
		rrest.mongo(function(err, db, release){
			db.collection("mongotest", function(err, collection){
				if(err) return mongo_err(err, release);
				collection.findOne({id: 1}, function(err, doc){
					if(err) return mongo_err(err, release);
					res.sendjson(doc);
					release();
				});
			});
		});
	}).listen(rrest.config.listenPort);

var mongo_err = function(err, release){
	console.log(err);
	return release();
};

rrest.mongo(function(err, db, release){//Caution release!
	if(err) return mongo_err(err, release);
	db.collection('mongotest', function(err, collection){
		if(err) return mongo_err
		collection.save({id:1, name:'Mongodb rrestjs test!'}, {"safe":true}, function(err,r){
			if(err) return mongo_err(err, release);	
			release();
		});
	});
});