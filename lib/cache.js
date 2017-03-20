'use strict'

var fns = require('./fns')
var sessionId = +new Date()
var sessionKey = 'session_'
console.log('[Session] Current ssid:', sessionId)
var cache = {
	session: {
		set: function (k, v, asyncCB) {
			return cache.set(sessionKey+k, v, -1*sessionId, asyncCB)
		},
		get: function (k, asyncCB) {
			return cache.get(sessionKey+k, asyncCB)
		}
	},
	/**
	 * setter
	 * @param {String} k      key
	 * @param {Object} v      value
	 * @param {Number} expire 过期时间，毫秒，为负数的时候表示为唯一session ID
	 * @param {Function} asyncCB optional, 是否异步、异步回调方法
	 */
	set: function (k, v, expire, asyncCB) {
		if (fns.type(expire) == 'function') {
			asyncCB = expire
			expire = 0
		} else if (asyncCB && fns.type(asyncCB) != 'function') {
			asyncCB = noop
		}
		expire = expire || 0
		if (expire > 0) {
			var t = + new Date()
			expire = expire + t
		}
		var data = {
			expr: +expire,
			data: v
		}
		if (asyncCB) {
			wx.setStorage({
				key: '_cache_' + k,
				data: data,
				success: function () {
					asyncCB()
				},
				fail: function (e) {
					asyncCB(e || `set "${k}" fail`)
				}
			})
		} else {
			wx.setStorageSync('_cache_' + k, data)
		}
	},
	/**
	 * getter
	 * @param {String} k      key
	 * @param {Function} asyncCB optional, 是否异步、异步回调方法
	 */
	get: function (k, asyncCB) {
		if (asyncCB) {
			if (fns.type(asyncCB) != 'function') asyncCB = noop
			var errMsg = `get "${k}" fail`
			wx.getStorage({
				key: '_cache_' + k,
				success: function (data) {
					if (data && data.data) {
						asyncCB(null, _resolve(k, data.data))
					} else {
						asyncCB(data ? data.errMsg || errMsg : errMsg)
					}
				},
				fail: function (e) {
					asyncCB(e || errMsg)
				}
			})
		} else {
			return _resolve(k, wx.getStorageSync('_cache_' + k))
		}
	}
}
function _resolve(k, v) {
	if (!v) return null
	// 永久存储
	if (!v.expr) return v.data
	else {
		if (v.expr < 0 && -1*v.expr == sessionId) {
			// session
		 	return v.data
		} else if (v.expr > 0 && new Date() < v.expr) {
			// 普通存储
			return v.data
		} else {
		 	wx.removeStorage({
		 		key: k
		 	})
			return null
		}
	}
}
function noop() {}
module.exports = cache
