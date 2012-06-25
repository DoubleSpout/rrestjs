//新手入门
var home = {},
	title = _rrest.config.webtitle;
home.index = function(req, res){
	res.render('/feature.jade', {pagetitle:title+'-功能', h1class:'h1_p'});
	return;
}
module.exports = home; 