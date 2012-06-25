var home = {},
	title = _rrest.config.webtitle;
home.index = function(req, res){
	res.render('/test.jade', {pagetitle:title+'-性能', h1class:'h1_p'});
	return;
}
module.exports = home; 