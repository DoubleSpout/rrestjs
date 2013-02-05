var apiReq = require('./apiReq'),
	msg =  require('./msg/msg');



var jsonobj = {}
jsonobj.parse = function(req, res, callback){

	apiReq(req, res, function(err, obj){
		if(err) return callback(err);
		var error = null;
		try{


			req.apibody = JSON.parse(obj.body);
			
		}
		catch(e){
			error = e;
			//console.log(e.stack);			
		}

		error?callback(msg.resmsg.postputError) : callback(null);
	})

}





module.exports = jsonobj