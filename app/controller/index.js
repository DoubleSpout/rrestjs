var home = {},
	title = _rrest.config.webtitle;
home.index = function(req, res){
	res.render('/index.jade', {pagetitle:title+'-首页', h1class:''});
	return;
}
module.exports = home; 