//新手入门
var home = {},
	title = _rrest.config.webtitle;
home.index = function(req, res){
	res.render('/study.jade', {pagetitle:title+'-教程', h1class:'h1_p'});
	return;
}
module.exports = home; 