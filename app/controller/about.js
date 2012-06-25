var home = {},
	title = _rrest.config.webtitle;
home.index = function(req, res){
	res.render('/about.jade', {pagetitle:title+'-了解rrestjs', h1class:'h1_p'});
	return;
}
module.exports = home; 