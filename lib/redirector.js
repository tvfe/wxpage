'use strict';
/**
 * 对wx.navigateTo、wx.redirectTo、wx.navigateBack的包装，在它们的基础上添加了事件
 */
var Message = require("../message")
var exportee = module.exports = new Message()
var timer, pending

exportee.on('page:ready', function () {
	setTimeout(function () {
		clearTimeout(timer)
		pending = false
	}, 100)
})
function route(type, cfg, args) {
	if (pending) return
	pending = true
	clearTimeout(timer)
	timer = setTimeout(function () {
		pending = false
	}, 2000)
	exportee.emit('navigateTo', cfg.url);
	return wx[type].apply(wx, args);
}
exportee.navigateTo = function (cfg) {
	return route('navigateTo', cfg, arguments)
}
exportee.redirectTo = function (cfg) {
	return route('redirectTo', cfg, arguments)
}
exportee.switchTab = function (cfg) {
	return route('switchTab', cfg, arguments)
}
exportee.navigateBack = function () {
    return wx.navigateBack.apply(wx, arguments);
}
exportee.preLoad = function(url){
	exportee.emit('preLoad', url);
}
