var cache = require('./cache')
var redirector = require('./redirector')
var conf = require('./conf')
var fns = require('./fns')
var navigate = route({type: 'navigateTo'})
var redirect = route({type: 'redirectTo'})
var switchTab = route({type: 'switchTab'})
var reLaunch = route({type: 'reLaunch'})
var routeMethods = {navigate, redirect, switchTab, reLaunch}
var bindNavigate = clickDelegate('navigate')
var bindRedirect = clickDelegate('redirect')
var bindSwitch = clickDelegate('switchTab')
var bindReLaunch = clickDelegate('reLaunch')
var channel = {}
var dispatcher
var getRef

module.exports = {
	channel,
	dispatcher: function (d) {
		dispatcher = d
	},
	ref: function (fn) {
		getRef = fn
	},
	mount: function (e) {
		var payload = e.detail
		switch(payload.type) {
			case 'attached':
				let ref = getRef && getRef(payload.id)
				if (!ref) return

				let refName = ref.properties._ref || ref.properties.ref
				if (refName) {
					this.$refs[refName] = ref
				}
				ref._$attached(this)
				break
			case 'event:call':
				let method = this[payload.method]
				method && method.apply(this, payload.args)
			default:
				break
		}
	},
	redirectDelegate: function (emitter, dispatcher) {
		;['navigateTo', 'redirectTo', 'switchTab', 'reLaunch'].forEach(function (k) {
			emitter.on(k, function (url) {
				var name = getPageName(url)
				name && dispatcher.emit(k+':'+name, url, fns.queryParse(url.split('?')[1]))
			})
		})
	},
	methods: function (ctx) {
		/**
		 * 缓存
		 */
		ctx.$cache = cache
		ctx.$session = cache.session
		/**
		 * 存一次，取一次
		 */
		ctx.$put = put
		/**
		 * 只能被取一次
		 */
		ctx.$take = take
		/**
		 * 实例引用集合
		 */
		ctx.$refs = {}

		/**
		 * 路由方法
		 */
		ctx.$route = ctx.$navigate = navigate
		ctx.$redirect = redirect
		ctx.$switch = switchTab
		ctx.$launch = reLaunch
		ctx.$back = back
		/**
		 * 页面预加载
		 */
		ctx.$preload = preload
		/**
		 * 点击跳转代理
		 */
		ctx.$bindRoute = ctx.$bindNavigate = bindNavigate
		ctx.$bindRedirect = bindRedirect
		ctx.$bindSwitch = bindSwitch
		ctx.$bindReLaunch = bindReLaunch
		/**
		 * 页面信息
		 */
		ctx.$curPage = getPage
		ctx.$curPageName = curPageName
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
			pagepath = (conf.get('customRouteResolve') || conf.get('routeResolve'))(pagepath)
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
	name && dispatcher && dispatcher.emit('preload:'+name, url, fns.queryParse(url.split('?')[1]))
}
function getPage() {
	return getCurrentPages().slice(0).pop()
}
function getPageName(url) {
	var m = /^[\w\-]+(?=\?|$)/.exec(url)
	return m ? m[0] : conf.get('nameResolve')(url)
}
function curPageName () {
	var route = getPage().route
	if (!route) return ''
	return getPageName(route)
}
function put (key, value) {
	channel[key] = value
	return this
}
function take (key) {
	var v = channel[key]
	// 释放引用
	channel[key] = null
	return v
}
