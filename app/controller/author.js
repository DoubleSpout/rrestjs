var home = {},
	title = _rrest.config.webtitle;
home.index = function(req, res){
	res.render('/author.jade', false, {pagetitle:title+'-作者', h1class:'h1_p'});
	return;
}
module.exports = home; 