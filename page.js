'use strict'

var fns = require('./lib/fns.js')
var message = require('./lib/message')
var redirector = require('./lib/redirector')
var Component = require('./lib/component.js')
var dispatcher = new message()
var channel = {}
var homePage
var hasPageLoaded = 0
var hideTime = 0
var MIN15 = 900000 // 15*60*1000
var routeResolve
var nameResolve

function WXPage(name, option) {
	// the first time execute page is the home page
	if (!homePage) homePage = name

	const PAGE_PATH = routeResolve(name).replace(/^\/?/, '/?')
	// mixin component defs
	Component.use(option, option.comps, `Page[${name}]`)
	if (option.onNavigate){
		let onNavigateHandler = function (url, query) {
			option.onNavigate({url, query})
		}
		console.log(`Page[${name}] define a "onNavigate" method.`)
		dispatcher.on('navigateTo:'+name, onNavigateHandler)
		dispatcher.on('redirectTo:'+name, onNavigateHandler)
		dispatcher.on('switchTab:'+name, onNavigateHandler)
	}
	/**
	 * Preload lifecycle method
	 */
	if (option.onPreload){
		console.log(`Page[${name}] define an "onPreload" method.`)
		dispatcher.on('preload:'+name, function (url, query) {
			option.onPreload({url, query})
		})
	}
	/**
	 * Preload another page in current page
	 */
	option.$preload = function(url){
		var name = getPageName(url)
		name && dispatcher.emit('preload:'+name, url, fns.queryParse(url.split('?')[1]))
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
	 * @param {String} prefix prefix of component's data
	 * @param {Object} data
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
	 * 方法挂在的属性，在页面加载的时候会被丢弃掉, 不能直接挂在方法模块
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

	// call on launch
	if (option.onLaunch) {
		option.onLaunch()
	}
	Page(option);
	return option;
}
function pageRedirectorDelegate(emitter, keys) {
	keys.forEach(function (k) {
		emitter.on(k, function (url) {
			var name = getPageName(url)
			name && dispatcher.emit(k+':'+name, url, fns.queryParse(url.split('?')[1]))
		})
	})
}
pageRedirectorDelegate(redirector, ['navigateTo', 'redirectTo', 'switchTab'])

/**
 * Application wrapper
 */
function Application (option) {
	if (option.config) {
		WXPage.config(option.config)
	}
	/**
	 * APP long sleep logical
	 */
	if (option.onShow) {
		fns.wrapFun(option.onShow, function () {
			var t = hideTime;
			hideTime = 0;
			if (t && new Date() - t > MIN15) {
				message.emit('App:longSleep')
			}
		})
	}
	if (option.onHide) {
		fns.wrapFun(option.onHide, function () {
			hideTime = new Date()
		})
	}
	/**
	 * Use app config
	 */
	App(option)
}
/**
 * Redirect functions
 */
function home(q) {
	this.$switch(homePage + (q ? '?' + fns.queryStringify(q) :''))
}
function back() {
	if (getCurrentPages().length > 1) {
		wx.navigateBack()
	} else {
		this.$switch(homePage)
	}
}
/**
 * Navigate handler
 */
function route ({type}) {
	// url: $page[?name=value]
	return function (url, config) {
		var parts = url.split(/\?/)
		var pagepath = parts[0]
		if (/^[\w\-]+$/.test(pagepath)) {
			pagepath = routeResolve(pagepath)
		}
		if (!pagepath) {
			throw new Error('Invalid path:', pagepath)
		}
		config = config || {}
		// append querystring
		config.url = pagepath + (parts[1] ? '?' + parts[1] : '')
    redirector[type](config)
	}
}
function getPageName(url) {
	var m = /^[\w\-]+(?=\?|$)/.exec(url)
	return m ? m[0] : nameResolve(url)
}

WXPage.C = WXPage.Comp = WXPage.Component = Component
WXPage.A = WXPage.App = WXPage.Application = Application
/**
 * Config handler
 */
function _conf(k, v) {
	switch(k) {
		case 'home':
			homePage = v
			break
		case 'route':
			if (fns.type(v) == 'string') {
					var PATH_REG = new RegExp('^'+v.replace(/^\/?/, '/?').replace(/[\.]/g, '\\.').replace('$page', '([\\w\\-]+)'))
					routeResolve = function (name) {
						return v.replace('$page', name)
					}
					nameResolve = function (url) {
						var m = PATH_REG.exec(url)
						return m ? m[1] : ''
					}
			} else {
				console.error('Illegal routes option:', v)
			}
			break
	}
}
WXPage.config = function (key, value) {
	if (fns.type(key) == 'object') {
		fns.objEach(key, function (k, v) {
			_conf(k, v)
		})
	} else {
		_conf(key, value)
	}
	return this
}
module.exports = WXPage
