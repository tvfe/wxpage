'use strict'

var fns = require('./lib/fns.js')
var message = require('./lib/message')
var redirector = require('./lib/redirector')
var Component = require('./lib/component.js')
var routeConfig = {
	index: 'pages/index'
}
var channel = {}
// 专题页的入口可能不是index哦
var HOME_PAGE = 'index'
var hasPageLoaded = 0

function WXPage(name, option) {
	const PAGE_ROUTE = new RegExp(`^/pages/${name}`)

	// mixin component defs
	Component.use(option, option.comps, `Page[${name}]`)

	if (option.onNavigate){
		redirector.on('navigateTo', function (url) {
			if (PAGE_ROUTE.test(url)) {
				option.onNavigate.call(option, {
					url: url,
					query: fns.queryParse(url.split('?')[1] || '')
				});
			}
		});
	}

	if (option.onPreload){
		console.log(`Page ${name} definds an onPreload`)
		redirector.on('preload', function (url) {
			if (PAGE_ROUTE.test(url)) {
				option.onPreload.call(option, {
					url: url,
					query: fns.queryParse(url.split('?')[1] || '')
				});
			}
		});
	}

	//预加载某个页面，如首页调用该方法，预加载频道页
	option.$preload = function(url){
		redirector.preload(url)
	}
	/**
	 * Instance props
	 */
	option.$name = name

	/**
	 * Instance method hook
	 */
	option.$route = route({type: 'navigateTo'})
	option.$redirect = route({type: 'redirectTo'})
	option.$switch = route({type: 'switchTab'})
	option.$home = home
	option.$back = back
	option.$state = {
		// 是否小程序被打开首页启动页面
		firstOpen: false,
		// 是否由分享打开的首个启动页面
		firstShareOpen: false
	}
	/**
	 * 存一次，取一次
	 */
	option.$put = function (key, value) {
		channel[key] = value
		return this
	}
	/**
	 * 只能被取一次
	 */
	option.$take = function (key) {
		var v = channel[key]
		// 释放引用
		channel[key] = null
		return v
	}
	/**
	 * setData wrapper, for component setData with prefix
	 * @param {String} prefix [description]
	 * @param {Object} data   [description]
	 */
	option.$setData = function (prefix, data) {
		if (fns.type(prefix) == 'string') {
			var props = {}
			fns.objEach(data, function (k,v) {
				props[prefix + '.' + k] = v
			})
			return this.setData(props)
		} else if (fns.type(prefix) == 'object') {
			return this.setData(prefix)
		}
	}
	option.$curPage = function () {
		return getCurrentPages().slice(0).pop()
	}
	/**
	 * Instance property
	 * 方法挂在的属性，在页面加载的时候会被丢弃掉
	 * 所以不能直接挂在方法模块
	 */

	/**
	 * 分享配置方法包壳
	 */
	if (option.onShareAppMessage) {
		let onShare = option.onShareAppMessage
		option.onShareAppMessage = function () {
			var res = onShare.apply(this, arguments)
			if (res && !/\bptag=/.test(res.path)) {
				res.path = fns.queryJoin(res.path, {
					ptag: 'share'
				})
			}
			console.log('[Share]', res)
			return res
		}
	}

	/**
	 * AOP life-cycle methods hook
	 */
	option.onLoad = fns.wrapFun(option.onLoad, function (res) {
		// After onLoad, onAwake is valid if defined
		option.onAwake && message.on('App:longSleep', () => {
			option.onAwake.call(this)
		})
		var ptag = res && res.ptag
		if (ptag){
			//This is the first page app opened. Mark the ptag
			getApp().global.ptag = ptag + ":" + name;
		}
		if (!hasPageLoaded) {
			hasPageLoaded = true

			let $state = this.$state
			$state.firstOpen = true
			$state.firstShareOpen = !!ptag
		}
	})
	option.onReady = fns.wrapFun(option.onReady, function () {
		redirector.emit('page:ready')
	})
	Page(option);
	return option;
}
/**
 * Redirect functions
 */
function home(q) {
	this.$switch(HOME_PAGE + (q ? '?' + fns.queryStringify(q) :''))
}
function back() {
	if (getCurrentPages().length > 1) {
		wx.navigateBack()
	} else {
		this.$switch(HOME_PAGE)
	}
}
function route ({type}) {
	return function (url, config) {
		// @url $page[?name=value]
		var parts = url.split(/\?/);
		var pagename = parts[0];
		var matches = pagename.match(/\/?pages\/(\w+)\/index$/)
		if (matches) {
			pagename = matches[1]
		}
		config = config || {};
		// append querystring
		config.url = routeConfig[pagename] + (parts[1] ? '?' + parts[1] : '');
		if (!config.url) {
			throw new Error('Invalid pagename:', pagename)
		}
    	redirector[type](config);
	}
}
WXPage.Component = Component
module.exports = WXPage
