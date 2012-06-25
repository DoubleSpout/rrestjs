var rrest = require('rrestjs');
rrest.config.webtitle = 'rrestjs高性能node.js框架';
module.exports = function(req, res){
	try{
		require('./'+req.path[0])[req.path[1]](req, res);
	}
	catch(err){
		restlog.info(req.path.join('/')+'; '+err)
		res.r404();
	}
}