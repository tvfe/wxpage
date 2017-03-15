'use strict'

var resolve = function (name) {
	return `/pages/${name}/index`
}
var channel = {}
function WXPage(name, option) {
	const PAGE_ROUTE = new RegExp(`^/pages/${name}/index`)

	// mixin component defs
	Component.use(option, option.comps, `Page[${name}]`)

	if (option.onNavigate){
		console.log(`Page[${name}] definds an onNavigate`)
		navigator.on('navigateTo', function (url) {
			if (PAGE_ROUTE.test(url)) {
				option.onNavigate.call(option, {
					url: url,
					query: fns.queryParse(url.split('?')[1] || '')
				});
			}
		});
	}

	if (option.onPreload){
		console.log(`Page[${name}] definds an onPreload`)
		navigator.on('preload', function (url) {
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
		navigator.preload(url)
	}

	/**
	 * Instance props
	 */
	option.$name = name

	/**
	 * Instance method hook
	 */
	option.$route = _$route({type: 'navigateTo'})
	option.$redirect = _$route({type: 'redirectTo'})
	option.$switch = _$route({type: 'switchTab'})

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

	option.onReady = fns.wrapFun(option.onReady, function () {
		navigator.emit('page:ready')
	})
	Page(option)
	return option
}
WXPage.Component = Component
function _$route ({type}) {
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
		config.url = resolve(pagename) + (parts[1] ? '?' + parts[1] : '');
		if (!config.url) {
			throw new Error('Invalid pagename:', pagename)
		}
    	navigator[type](config);
	}
}

/**
 * Component define
 */
function Component(name, ctor/*[ ctor ]*/) {
	if (fns.type(name) == 'function' && arguments.length == 1) {
		ctor = name
		name = ''
	}
	return function () {
		var def = ctor.apply(this, arguments)
		if (!def) {
			// 容错，不抛错
			console.error(`Illegal component options [${name || 'Anonymous'}]`)
			def = {}
		}
		useComponents(def, def.comps, `Component[${name || 'Anonymous'}]`)
		delete def.comps
		if (name && def.data) {
			var data = {}
			data[name] = def.data
			def.data = data
		}
		return def
	}
}
function useComponents(option, comps, label) {
	// mixin component defs
	if (comps) {
		comps.forEach(function (def) {
			if (typeof def == 'function') {
				def = def()
			}
			fns.objEach(def, function(k, v) {
				if (option.hasOwnProperty(k)) {
					switch(k) {
						case 'comps':
							useComponents(option, v)
							return
						case 'onReady':
						case 'onShow':
						case 'onHide':
						case 'onUnload':
						case 'onPullDownRefresh':
						case 'onReachBottom':
						case 'onLoad':
						case 'onNavigate':
						case 'onPreload':
						case 'fetchData':
							option[k] = fns.wrapFun(option[k], v)
							return
						case 'data':
							option[k] = fns.extend({}, option.data, v)
							return
						default:
							console.warn(`Property ${k} is already defined by ${label}`);
					}
				}
				// assign to page option
				option[k] = v;
			})
		})
	}
}
Component.use = useComponents

/**
 * Simple Pub/Sub module
 */
function Message() {
	this._evtObjs = {};
}
var MessageProto = Message.prototype
MessageProto.on = function (evtType, handler, _once) {
	if (!this._evtObjs[evtType]) {
		this._evtObjs[evtType] = [];
	}
	this._evtObjs[evtType].push({
		handler: handler,
		once: _once
	})
	var that = this
	return function () {
		that.off(evtType, handler)
	}
}
MessageProto.off = function (evtType, handler) {
	var types;
	if (evtType) {
		types = [evtType]
	} else {
		types = Object.keys(this._evtObjs)
	}
	var that = this;
	types.forEach(function (type) {
		if (!handler) {
			// remove all
			that._evtObjs[type] = []
		} else {
			var handlers = that._evtObjs[type] || [],
				nextHandlers = [];

			handlers.forEach(function (evtObj) {
				if (evtObj.handler !== handler) {
					nextHandlers.push(evtObj)
				}
			})
			that._evtObjs[type] = nextHandlers
		}
	})

	return this;
}
MessageProto.emit = function (evtType) {
	var args = Array.prototype.slice.call(arguments, 1)

	var handlers = this._evtObjs[evtType] || []
	handlers.forEach(function (evtObj) {
		if (evtObj.once && evtObj.called) return
		evtObj.called = true
		try {
			evtObj.handler && evtObj.handler.apply(null, args)
		} catch(e) {
			console.error(e.stack || e.message || e)
		}
	})
}
MessageProto.assign = function (target) {
	var msg = this;
	;['on', 'off', 'wait', 'emit'].forEach(function (name) {
		var method = msg[name]
		target[name] = function () {
			return method.apply(msg, arguments)
		}
	})
}
;(new Message()).assign(Message)


/**
 * Navigate wrapper
 * 对wx.navigateTo、wx.redirectTo、wx.navigateBack的包装，在它们的基础上添加了事件
 */
var navigator = new Message()
var timer, pending
navigator.on('page:ready', function () {
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
	navigator.emit('navigateTo', cfg.url)
	return wx[type].apply(wx, args)
}
navigator.navigateTo = function (cfg) {
	return route('navigateTo', cfg, arguments)
}

navigator.redirectTo = function (cfg) {
	return route('redirectTo', cfg, arguments)
}
navigator.switchTab = function (cfg) {
	return route('switchTab', cfg, arguments)
}
navigator.navigateBack = function () {
  return wx.navigateBack.apply(wx, arguments)
}
navigator.preload = function(url){
	var parts = url.split('?')
	var path = parts[0]
	if (/^\w+$/.test(path)) {
		path = resolve(path)
	}
	navigator.emit('preload', path + '?' + parts[1])
}

/**
 * Util functions
 */
var undef = void(0)
function hasOwn (obj, prop) {
	return obj && obj.hasOwnProperty && obj.hasOwnProperty(prop)
}
var fns = {
	type: function(obj) {
		if (obj === null) return 'null'
		else if (obj === undef) return 'undefined'
		var m = /\[object (\w+)\]/.exec(Object.prototype.toString.call(obj))
		return m ? m[1].toLowerCase() : ''
	},
	extend: function(obj) {
		if (fns.type(obj) != 'object' && fns.type(obj) != 'function') return obj;
		var source, prop;
		for (var i = 1, length = arguments.length; i < length; i++) {
			source = arguments[i];
			for (prop in source) {
				if (hasOwn(source, prop)) {
					obj[prop] = source[prop];
				}
			}
		}
		return obj;
	},
	objEach: function (obj, fn) {
		if (!obj) return
		for(var key in obj) {
			if (hasOwn(obj, key)) {
				if(fn(key, obj[key]) === false) break
			}
		}
	},
	wrapFun: function (pre, wrapper) {
		return function () {
			try {
				wrapper && wrapper.apply(this, arguments)
			} finally{
				pre && pre.apply(this, arguments)
			}
		}
	},
	/**
	 *  解析 query 字符串
	 **/
	queryParse: function(search, spliter) {
		if (!search) return {};

		spliter = spliter || '&';

		var query = search.replace(/^\?/, ''),
			queries = {},
			splits = query ? query.split(spliter) : null;

		if (splits && splits.length > 0) {
			splits.forEach(function(item) {
				item = item.split('=');
				var key = item.splice(0, 1),
					value = item.join('=');
				queries[key] = value;
			});
		}
		return queries;
	},
	/**
	 * URL添加query
	 */
	queryJoin: function (api, queries, unencoded) {
		var qs = fns.queryStringify(queries, '&', unencoded)
		if (!qs) return api

		var sep
		if (/[\?&]$/.test(api)) {
			sep = ''
		} else if (~api.indexOf('?')) {
			sep = '&'
		} else {
			sep = '?'
		}
		return api + sep + qs
	},
	/**
	 * query 对象转换字符串
	 */
	queryStringify: function (params, spliter, unencoded) {
		if (!params) return ''
		return Object.keys(params).map(function (k) {
			var v = params[k]
			return k + '=' + (unencoded ? v : encodeURIComponent(v))
		}).join(spliter || '&')
	},
}

module.exports = WXPage
