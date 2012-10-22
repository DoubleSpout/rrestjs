/**
 * RestFavicon.js 是自动响应浏览器favicon.ico请求的模块
 *
 * @exports fn(res, path)
 */
var fs = require('fs'),
    path = require('path'),
    restUtils = require('./RestUtils'),
    msg = require('./msg/msg'),
    iconPath = path.join(_restConfig.baseDir, _restConfig.favicon),
    iconData;

/**
 * 输出favicon
 * @param {Response} res
 * @param {String} path
 * @return {Boolean}
 */
module.exports = function (res, path) {
    // 如果有缓存，则输出缓存
    if (iconData) {
        return sendFavicon(true, res);
    }
    // 没有则去读取文件
    fs.readFile(path || iconPath, function(err, buf) {
        if (err) {
            // 出错响应500
            return restUtils.errorRes(res, msg.resmsg.faviconError);
        }
        // 无缓存响应
		sendFavicon(false, res, buf);
    });
    return false;
};

/**
 * 响应favicon方法
 * @param {Boolean} isCache
 * @param {Response} res
 * @param {Buffer} buf
 * @return {Boolean}
 */
function sendFavicon(iscache, res, buf){//
    if (!iscache) {//如果未缓存
        iconData = { //设置头信息
            headers: {
                'Content-Type': 'image/x-icon',
                'Content-Length': buf.length,
                'ETag': '"' + restUtils.md5(buf) + '"',
                'Cache-Control': 'public, max-age=' + (_restConfig.statciMaxAge / 1000)
            },
            body: buf
        };
    }
    res.writeHead(200, iconData.headers);
    res.end(iconData.body);
    return true;
}
