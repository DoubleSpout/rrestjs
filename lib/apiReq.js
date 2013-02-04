var postLimit = _restConfig.postLimit,//上传文件大小限制
	msg =  require('./msg/msg');

module.exports = function(req, res, callback){

	var buf = new Buffer('');
	var content_len = req.headers['content-length'] - 0;
	var callback = callback || function(){};
    var notchunked = !req.ischunked;

    
	req.on('data',function(chunk){
        buf = Buffer.concat([chunk],1);
        
		if(buf.length > postLimit){
			req.connection.destroy()
		}
	})

	req.on('end',function(){
		
		if( buf.length >= postLimit){
			callback(msg.resmsg.postputError)
		}

		var strobj = {body:buf.toString()}
		req._body = strobj.body;

		callback(null, strobj)

	})

	req.on('error',function(e){
		console.log(e);

		callback(msg.resmsg.postputError)
	})


}