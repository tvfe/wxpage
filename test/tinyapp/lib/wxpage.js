module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var undef = void(0)
function hasOwn (obj, prop) {
	return obj && obj.hasOwnProperty && obj.hasOwnProperty(prop)
}
function _nextTick() {
	// global
	var ctx = this
	return function () {
		return setTimeout.apply(ctx, arguments)
	}
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
	nextTick: _nextTick(),
	/**
	 * Lock function before lock release
	 */
	lock: function lock(fn) {
		var pending
		return function () {
			if (pending) return
			pending = true
			var args = [].slice.call(arguments, 0)
			args.unshift(function () {
				pending = false
			})
			return fn.apply(this, args)
		}
	},
	/**
	 * Queue when pending, execute one by one
	 * @param {Function} fn executed function
	 * @param {Number} capacity Allow run how much parall task at once
	 * @async
	 */
	queue: function queue(fn, capacity) {
		capacity = capacity || 1
		var callbacks = []
		var remains = capacity
		function next() {
			var item = callbacks.shift()
			if (!item) {
				remains = capacity
				return
			}
			remains--
			var fn = item[0]
			var ctx = item[1]
			var args = item[2]
			args.unshift(function () {
				// once task is done, remains increasing
				remains ++
				// then check or call next task
				next.apply(this, arguments)
			})
			fns.nextTick(function () {
				return fn.apply(ctx, args)
			})
		}
		return function () {
			callbacks.push([fn, this, [].slice.call(arguments, 0)])
			if (!remains) return
			return next()
		}
	},
	/**
	 * Queue and wait for the same result
	 * @param {Function} delegate method
	 * @return {Function} the method receive a callback function
	 */
	delegator: function (fn) {
		var pending
		var queue = []
		return function (cb) {
			if (pending) return queue.push(cb)
			pending = true
			fn.call(this, function () {
				pending = false
				var ctx = this
				var args = arguments
				cb && cb.apply(ctx, args)
				queue.forEach(function (f) {
					f && f.apply(ctx, args)
				})
			})
		}
	},
	/**
	 * Call only once
	 */
	once: function (fn/*[, ctx]*/) {
		var args = arguments
		var called
		return function () {
			if (called || !fn) return
			called = true
			return fn.apply(args.length >=2 ? args[1] : null, arguments)
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
	wrapFun: function (pre, wrapper) {
		return function () {
			try {
				wrapper && wrapper.apply(this, arguments)
			} finally{
				pre && pre.apply(this, arguments)
			}
		}
	}
}

module.exports = fns


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 *  Simple Pub/Sub module
 *  @tencent/message and 减掉fns依赖
 **/


function Message() {
	this._evtObjs = {};
}
Message.prototype.on = function (evtType, handler, _once) {
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
Message.prototype.off = function (evtType, handler) {
	var types;
	if (evtType) {
		types = [evtType];
	} else {
		types = Object.keys(this._evtObjs)
	}
	var that = this;
	types.forEach(function (type) {
		if (!handler) {
			// remove all
			that._evtObjs[type] = [];
		} else {
			var handlers = that._evtObjs[type] || [],
				nextHandlers = [];

			handlers.forEach(function (evtObj) {
				if (evtObj.handler !== handler) {
					nextHandlers.push(evtObj)
				}
			})
			that._evtObjs[type] = nextHandlers;
		}
	})

	return this;
}
Message.prototype.emit = function (evtType) {
	var args = Array.prototype.slice.call(arguments, 1)

	var handlers = this._evtObjs[evtType] || [];
	handlers.forEach(function (evtObj) {
		if (evtObj.once && evtObj.called) return
		evtObj.called = true
		try {
			evtObj.handler && evtObj.handler.apply(null, args);
		} catch(e) {
			console.error(e.stack || e.message || e)
		}
	})
}
Message.prototype.assign = function (target) {
	var msg = this;
	['on', 'off', 'wait', 'emit'].forEach(function (name) {
		var method = msg[name]
		target[name] = function () {
			return method.apply(msg, arguments)
		}
	})
}
/**
 *  Global Message Central
 **/
;(new Message()).assign(Message)
module.exports = Message;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fns = __webpack_require__(0)
/**
 * Component instance
 */
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
						case 'id':
							// skip
							return
						case 'comps':
							useComponents(option, v)
							return
						case 'onLoad':
						case 'onReady':
						case 'onShow':
						case 'onHide':
						case 'onUnload':
						case 'onPullDownRefresh':
						case 'onReachBottom':
						// extend
						case 'onNavigate':
						case 'onPreload':
						case 'onLaunch':
						case 'onAwake':
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
				option[k] = v
			})
		})
	}
}
/**
 * Component constructor
 */
function component(name, ctor/*[ ctor ]*/) {
	var ct = fns.type(name)
	if ((ct == 'function' || ct == 'object') && arguments.length == 1) {
		ctor = name
		name = ''
	}
	return function (cid) {
		var ctx
		var dat = {}
		var vm = {
			$set: function (data) {
				if (!cid) return
				if (!ctx) {
					fns.objEach(data, function (k, v) {
						_set(dat, k, v)
					})
				} else {
					ctx.$setData(cid, data)
				}
			}
		}
		var def = fns.type(ctor) == 'function'
			? ctor.call(this, vm)
			: fns.extend({}, ctor)

		def.onLoad = fns.wrapFun(def.onLoad, function () {
			ctx = this
		})

		if (!def) {
			console.error(`Illegal component options [${name || 'Anonymous'}]`)
			def = {}
		}
		useComponents(def, def.comps, `Component[${name || 'Anonymous'}]`)

		cid = cid || def.id || name
		if (!cid) {
			console.error(`Missing "id" property, it is necessary for component: `, def)
		}
		delete def.comps
		delete def.id
		if (cid && def.data) {
			var data = {}
			dat = data[cid] = def.data
			data[cid].$id = cid
			def.data = data
		}
		return def
	}
}
/**
 * set value by keypath
 */
function _set(obj, keypath, value) {
    var parts = keypath.split(/\[|\]?\./)
    var last = parts.pop()
    var dest = obj
    var hasError, errorInfo
    parts.some(function(key) {
      var t = fns.type(dest)
      if (t != 'object' && t != 'array') {
          hasError = true
          errorInfo = [key, dest]
          return true
      }
      dest = dest[key]
    })
    // set value
    if (!hasError) {
    	var t = fns.type(dest)
      if (t != 'object' && t != 'array') {
          hasError = true
          errorInfo = [last, dest]
      } else {
          dest[last] = value
          return obj
      }
    }
    console.error('Can not set "' + errorInfo[0] + '" to "'+ errorInfo[1] + '" when on "' + keypath + '"')
}

component.use = useComponents
module.exports = component


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * 对wx.navigateTo、wx.redirectTo、wx.navigateBack的包装，在它们的基础上添加了事件
 */
var Message = __webpack_require__(1)
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
	/**
	 * 2s内避免重复的跳转
	 */
	timer = setTimeout(function () {
		pending = false
	}, 2000)
	exportee.emit('navigateTo', cfg.url)
	return wx[type].apply(wx, args)
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
  return wx.navigateBack.apply(wx, arguments)
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fns = __webpack_require__(0)
var message = __webpack_require__(1)
var redirector = __webpack_require__(3)
var Component = __webpack_require__(2)
var dispatcher = new message()
var channel = {}
var homePage
var hasPageLoaded = 0
var hideTime = 0
var routeResolve
var nameResolve

function WXPage(name, option) {
	// the first time execute page is the home page
	if (!homePage) homePage = name
	// mixin component defs
	Component.use(option, option.comps, `Page[${name}]`)
	if (option.onNavigate){
		let onNavigateHandler = function (url, query) {
			option.onNavigate({url, query})
		}
		console.log(`Page[${name}] define "onNavigate".`)
		dispatcher.on('navigateTo:'+name, onNavigateHandler)
		dispatcher.on('redirectTo:'+name, onNavigateHandler)
		dispatcher.on('switchTab:'+name, onNavigateHandler)
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
	option.$back = back
	option.$state = {
		// 是否小程序被打开首页启动页面
		firstOpen: false
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
	option.onLoad = fns.wrapFun(option.onLoad, function() {
		// After onLoad, onAwake is valid if defined
		option.onAwake && message.on('app:sleep', function(t) {
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
	 * APP sleep logical
	 */
	option.onShow = option.onShow ? fns.wrapFun(option.onShow, appShowHandler) : appShowHandler
	option.onHide = option.onHide ? fns.wrapFun(option.onHide, appHideHandler) : appHideHandler

	if (option.onAwake) {
		message.on('app:sleep', function(t){
			option.onAwake.call(this, t)
		})
	}
	/**
	 * Use app config
	 */
	App(option)
}
function appShowHandler () {
	if (!hideTime) return
	var t = hideTime
	hideTime = 0
	message.emit('app:sleep', new Date() - t)
}
function appHideHandler() {
	hideTime = new Date()
}

/**
 * Redirect functions
 */
function back(delta) {
	wx.navigateBack({
		delta: delta || 1
	})
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


/***/ })
/******/ ]);