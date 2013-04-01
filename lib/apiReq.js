var postLimit = _restConfig.postLimit,//上传文件大小限制
	msg =  require('./msg/msg');

module.exports = function(req, res, callback){

	
	var content_len = req.headers['content-length'] - 0;
	var callback = callback || function(){};

    var rec_leng = 0;
    var rec_ary = [];

	req.on('data',function(chunk){
		
		rec_leng += chunk.length;
		rec_ary.push(chunk)

        
		if(rec_leng > postLimit){
			rec_ary = null;
			req.connection.destroy()
		}
	})

	req.on('end',function(){
		

		if( rec_leng >= postLimit){
			callback(msg.resmsg.postputError)
		}
		
		var buf =  Buffer.concat(rec_ary, rec_leng);

		var strobj = { body : buf.toString()};

		req._body = strobj.body;

		callback(null, strobj)

	})

	req.on('error',function(e){
		console.log(e);

		callback(msg.resmsg.postputError)
	})


}