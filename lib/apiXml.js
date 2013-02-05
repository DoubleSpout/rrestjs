var apiReq = require('./apiReq'),
    parseString = require('xml2js').parseString,
	convert  = require('data2xml')(),
	msg =  require('./msg/msg');



var xmlobj = {}
xmlobj.parse = function(req, res, callback){

	apiReq(req, res, function(err, obj){
		if(err) return callback(err);
		var error = null;
		try{

			 parseString(obj.body,function(err, result){
                if(err) return error = e;
                 req.apibody = result;
             });
		}
		catch(e){
			error = e;
		}

		error?callback(msg.resmsg.postputError) : callback(null);
	})

}

xmlobj.ToString = function(obj, callback){
	
	try{
		var xmlstr = convert('rrestApiXml', obj);
		callback(null, xmlstr);
	}	
	catch(e){
		console.log(e.stack)
		callback(e);
	}
}





module.exports = xmlobj