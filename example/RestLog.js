module.exports._config = require('./config/log.conf.js');
var rrest = require('../');
restlog = rrest.restlog;
rrest(function(){
	restlog.debug('debug');
	restlog.info('info')
	restlog.warn('warn');
	restlog.error('error');
	console.log('done')
});


//查看 ../mylogs/console.log文件即可