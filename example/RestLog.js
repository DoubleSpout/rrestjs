module.exports._config = require('./config/log.conf.js');
var rrest = require('../');
restlog.debug('debug');
restlog.info('info')
restlog.warn('warn');
restlog.error('error');
//查看 ../mylogs/console.log文件即可