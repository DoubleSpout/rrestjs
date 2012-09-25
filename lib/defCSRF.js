/*
查找整个模版所有的</form>
增加<input type="hidden" name="_restcsrf" value="xxxx" />
*/
var crypto = require('crypto');
module.exports = function(req, htmlstr){
	if(!req.session || !~htmlstr.indexOf('</form>')) return htmlstr;
	var csrf = crypto.createHash('sha1').update(Math.random()+'').digest('hex');
	return	(req.session._csrf = csrf) && htmlstr.replace(/<\/form>/g, '<input type="hidden" name="_csrf" value="'+csrf+'" /></form>')	 
		}