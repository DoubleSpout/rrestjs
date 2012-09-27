module.exports.index = function(req, res){
	res.send('user/index')
}
module.exports.face = function(req, res){
	res.send('user/face')
}

module.exports.info = function(req, res){
	res.setHeader('user','info')
	return true;
}