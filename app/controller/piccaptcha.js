var home = {},
	ca = require('../modules/captcha'),
	c_a_ary = require('../modules/captcha').captcha_ary;
home.index = function(req, res){
	var picid = req.getparam['picid'] || false;
	if(!picid || picid.length != 17) res.end('');
	else if (picid = ca.decode(picid)){
	var url = c_a_ary[picid-1].url+picid+'.png'
		res.sendfile(url,  function(error, file){
			if(error)  restlog.error('验证码图片显示error: ' + error);
		});
	}
	else res.end('');
}
module.exports = home;