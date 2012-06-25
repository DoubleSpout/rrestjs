module.exports.index = function(req, res){
	res.send('autoRouter complete! 用户自定义:' +res.name+'访问/index/jade，自动输出jade模版' );
}
module.exports.jade = function(req, res){
	res.render('auto');
}