var tools = {},
	crypto = require('crypto'),
	fs = require('fs');



tools.fdate = function(format){	
	var format = typeof format === 'undefined'?false:format.toLowerCase(),
		now = new Date(),
		time = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
	if(format === 'y-m-d h:m:s'){
		time += ' '+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds(); 
	}
	return time;
};
tools.checkemail = function(str){
	var reg = /^\w+((-|\.)\w+)*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
	return reg.test(str);
}
tools.htmltostring = function(text){
	text = text.replace(/&/g, "&amp;");
	text = text.replace(/"/g, "&quot;");
	text = text.replace(/</g, "&lt;");
	text = text.replace(/>/g, "&gt;");
	text = text.replace(/'/g, "&#146;");
	return  text;
}
tools.check_all_param = function(){
	var arg = [].slice.apply(arguments, [0, arguments.length]);
	for(var i=0;i<arg.length;i++){
		if(typeof arg[i] == 'undefined') return false;
	}
	return true;
}
tools.check_data = {}
tools.check_data.check_int = function(d){
	if(parseInt(d) != d) return false;
	return true;
}
tools.check_data.check_len = function(d, exlen){
	if(d.length != exlen) return false;
	return true;
}
tools.check_data.check_maxlen = function(d, maxlen){
	if(d.length > maxlen) return false;
	return true;
}
tools.get_id = function(db, string){//生成mongodb _id
	return db.bson_serializer.ObjectID.createFromHexString(string);
}
tools.addstar = function(str, tag){
	var tag = tag || '@',
		header = str.slice(0,2),
		tail = str.split(tag)[1];
	return header +'***'+tail
}

/**
 * Return md5 hash of the given string and optional encoding,
 * defaulting to hex.
 *
 *     utils.md5('wahoo');
 *     // => "e493298061761236c96b02ea6aa8a2ad"
 *
 * @param {String} str
 * @param {String} encoding
 * @return {String}
 * @api public
 */
tools.md5 = function(str, encoding){
  return crypto
    .createHash('md5')
    .update(str)
    .digest(encoding || 'hex');
}

module.exports = tools;


