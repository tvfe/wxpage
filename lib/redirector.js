'use strict';
/**
 * 对wx.navigateTo、wx.redirectTo、wx.navigateBack的包装，在它们的基础上添加了事件
 */
var Message = require('./message')
var conf = require('./conf')
var exportee = module.exports = new Message()
var timer, readyTimer, pending

exportee.on('page:ready', function () {
	readyTimer = setTimeout(function () {
		pending = false
	}, 100)
})
function route(type, cfg, args) {
	if (pending) return
	pending = true
	clearTimeout(timer)
	clearTimeout(readyTimer)
	var routeFrozenTime = conf.get('routeFrozenTime')
	/**
	 * 避免重复的跳转
	 */
	timer = setTimeout(function () {
		pending = false
	}, routeFrozenTime || routeFrozenTime === 0 ? routeFrozenTime : 1000)
	exportee.emit('navigateTo', cfg.url)

	// 会存在不兼容接口，例如：reLaunch
	if (wx[type]) {
		return wx[type].apply(wx, args)
	}
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
exportee.reLaunch = function (cfg) {
	return route('reLaunch', cfg, arguments)
}
exportee.navigateBack = function () {
  return wx.navigateBack.apply(wx, arguments)
}
