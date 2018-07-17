'use strict'

var fns = require('./lib/fns.js')
var message = require('./lib/message')
var redirector = require('./lib/redirector')
var cache = require('./lib/cache')
var Component = require('./lib/component.js')
var dispatcher = new message()
var channel = {}
var hasPageLoaded = 0
var isAppLaunched = 0
var isAppShowed = 0
var hideTime = 0
var routeResolve
var customRouteResolve
var nameResolve
var extendPageBefore
var extendPageAfter
var modules = {
	fns, redirector, cache, message, dispatcher, channel
}
function WXPage(name, option) {
	// page internal message
	var emitter = new message()

	// extend page config
	extendPageBefore && extendPageBefore(name, option, modules)

	// mixin component defs
	Component.use(option, option.comps, `Page[${name}]`, emitter)
	if (option.onNavigate){
		let onNavigateHandler = function (url, query) {
			option.onNavigate({url, query})
		}
		console.log(`Page[${name}] define "onNavigate".`)
		dispatcher.on('navigateTo:'+name, onNavigateHandler)
		dispatcher.on('redirectTo:'+name, onNavigateHandler)
		dispatcher.on('switchTab:'+name, onNavigateHandler)
		dispatcher.on('reLaunch:'+name, onNavigateHandler)
	}
	/**
	 * Preload lifecycle method
	 */
	if (option.onPreload){
		console.log(`Page[${name}] define "onPreload".`)
		dispatcher.on('preload:'+name, function (url, query) {
			option.onPreload({url, query})
		})
	}
	/**
	 * Preload another page in current page
	 */
	option.$preload = preload
	/**
	 * Instance props
	 */
	option.$name = name
	option.$cache = cache
	option.$session = cache.session
	option.$emitter = emitter
	option.$state = {
		// 是否小程序被打开首页启动页面
		firstOpen: false
	}

	/**
	 * Instance method hook
	 */
	option.$route = option.$navigate = navigate
	option.$redirect = redirect
	option.$switch = switchTab
	option.$launch = reLaunch
	option.$back = back

	/**
	 * Click delegate methods
	 */
	option.$bindRoute = option.$bindNavigate = bindNavigate
	option.$bindRedirect = bindRedirect
	option.$bindSwitch = bindSwitch
	option.$bindReLaunch = bindReLaunch

	/**
	 * Cross pages message methods
	 */
	option.$on = function () {
		return dispatcher.on.apply(dispatcher, arguments)
	}
	option.$emit = function () {
		return dispatcher.emit.apply(dispatcher, arguments)
	}
	option.$off = function () {
		return dispatcher.off.apply(dispatcher, arguments)
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
		return getPage()
	}
	option.$curPageName = function () {
		var route = getPage().route
		if (!route) return ''
		return getPageName(route)
	}
	/**
	 * AOP life-cycle methods hook
	 */
	option.onLoad = fns.wrapFun(option.onLoad, function() {
		// After onLoad, onAwake is valid if defined
		option.onAwake && message.on('app:sleep', (t) => {
			option.onAwake.call(this, t)
		})
		if (!hasPageLoaded) {
			hasPageLoaded = true

			let $state = this.$state
			$state.firstOpen = true
		}
	})
	option.onReady = fns.wrapFun(option.onReady, function () {
		redirector.emit('page:ready')
	})

	// call on launch
	if (option.onPageLaunch) {
		option.onPageLaunch()
	}
	if (option.onAppLaunch) {
		isAppLaunched ? option.onAppLaunch.apply(option, isAppLaunched) : dispatcher.on('app:launch', function (args) {
			option.onAppLaunch.apply(option, args)
		})
	}
	if (option.onAppShow) {
		isAppLaunched ? option.onAppShow.apply(option, isAppLaunched) : dispatcher.on('app:show', function (args) {
			option.onAppShow.apply(option, args)
		})
	}

	// extend page config
	extendPageAfter && extendPageAfter(name, option, modules)
	// register page
	Page(option)
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
pageRedirectorDelegate(redirector, ['navigateTo', 'redirectTo', 'switchTab', 'reLaunch'])

/**
 * Application wrapper
 */
function Application (option) {

	if (!option.config || !option.config.route || !option.config.route.length) {
		throw new Error('config.route is necessary !')
	}
	if (option.config) {
		WXPage.config(option.config)
	}
	var ctx = option
	/**
	 * APP sleep logical
	 */
	option.onShow = option.onShow ? fns.wrapFun(option.onShow, appShowHandler) : appShowHandler
	option.onHide = option.onHide ? fns.wrapFun(option.onHide, appHideHandler) : appHideHandler
	option.onLaunch = option.onLaunch ? fns.wrapFun(option.onLaunch, appLaunchHandler) : appLaunchHandler
	option.onLaunch = fns.wrapFun(option.onLaunch, function () {
		ctx = this
	})
	if (option.onAwake) {
		message.on('app:sleep', function(t){
			option.onAwake.call(ctx, t)
		})
	}
	/**
	 * Use app config
	 */
	App(option)
}
function appLaunchHandler() {
	isAppLaunched = [].slice.call(arguments)
	message.emit('app:launch', isAppLaunched)
}
function appShowHandler () {
	try {
		if (!isAppShowed) {
			// call onAppShow only once
			isAppShowed = [].slice.call(arguments)
			message.emit('app:show', isAppShowed)
		}
	} finally {
		if (!hideTime) return
		var t = hideTime
		hideTime = 0
		message.emit('app:sleep', new Date() - t)
	}
}
function appHideHandler() {
	hideTime = new Date()
}

/**
 * Redirect functions
 */
var navigate = route({type: 'navigateTo'})
var redirect = route({type: 'redirectTo'})
var switchTab = route({type: 'switchTab'})
var reLaunch = route({type: 'reLaunch'})
var routeMethods = {navigate, redirect, switchTab, reLaunch}
var bindNavigate = clickDelegate('navigate')
var bindRedirect = clickDelegate('redirect')
var bindSwitch = clickDelegate('switchTab')
var bindReLaunch = clickDelegate('reLaunch')

function clickDelegate(type) {
	var _route = routeMethods[type]
	return function (e) {
		if (!e) return
		var dataset = e.currentTarget.dataset
		var before = dataset.before
		var after = dataset.after
		var url = dataset.url
		var ctx = this
		try {
			if (ctx && before && ctx[before]) ctx[before].call(ctx, e)
		} finally {
			if (!url) return
			_route(url)
			if (ctx && after && ctx[after]) ctx[after].call(ctx, e)
		}
	}
}
function back(delta) {
	wx.navigateBack({
		delta: delta || 1
	})
}
function preload(url){
	var name = getPageName(url)
	name && dispatcher.emit('preload:'+name, url, fns.queryParse(url.split('?')[1]))
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
			pagepath = (customRouteResolve || routeResolve)(pagepath)
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
function getPage() {
	return getCurrentPages().slice(0).pop()
}
function getPageName(url) {
	var m = /^[\w\-]+(?=\?|$)/.exec(url)
	return m ? m[0] : nameResolve(url)
}

WXPage.C = WXPage.Comp = WXPage.Component = Component
WXPage.A = WXPage.App = WXPage.Application = Application
WXPage.redirector = redirector
WXPage.message = message
WXPage.cache = cache
WXPage.fns = fns

/**
 * Config handler
 */

function _conf(k, v) {
	switch(k) {
		case 'extendPageBefore':
			extendPageBefore = v
			break
		case 'extendPageAfter':
			extendPageAfter = v
			break
		case 'resolvePath':
			if (fns.type(v) == 'function') {
				customRouteResolve = v
			}
			break
		case 'route':
			let t = fns.type(v)
			if (t == 'string' || t == 'array') {
					let routes = (t == 'string' ? [v]:v)
					let mainRoute = routes[0]
					routes = routes.map(function (item) {
						return new RegExp('^'+item
							.replace(/^\/?/, '/?')
							.replace(/[\.]/g, '\\.')
							.replace('$page', '([\\w\\-]+)')
						)
					})
					routeResolve = function (name) {
						return mainRoute.replace('$page', name)
					}
					nameResolve = function (url) {
						var n = ''
						routes.some(function (reg) {
							var m = reg.exec(url)
							if (m) {
								n = m[1]
								return true
							}
						})
						return n
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
message.assign(WXPage)
message.assign(Component)
message.assign(Application)
module.exports = WXPage
