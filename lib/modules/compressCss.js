module.exports = function(str){
	var str = str;
	str = str.replace(/\/\*(.*?)\*\/|[\t\r\n]/g, "");
	str = str.replace(/ +\{ +|\{ +| +\{/g, "{");
	str = str.replace(/ +\} +|\} +| +\}/g, "}");
	str = str.replace(/ +: +|: +| +:/g, ":");
	str = str.replace(/ +, +|, +| +,/g, ",");
	return str;
}