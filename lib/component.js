'use strict'

var fns = require('./fns.js')
/**
 * Component instance
 */
function useComponents(option, comps, label, emitter) {
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
							useComponents(option, v, label, emitter)
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
						case 'onAppLaunch':
						case 'onAppShow':
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

			def.__$instance && def.__$instance(emitter)
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
		var emitter
		var dat = {}
		var vm = {
			$set: function (data) {
				if (!cid || !ctx) return
				ctx.$setData(cid, data)
			},
			$data: function () {
				if (!ctx) return dat
				else if (cid) return ctx.data[cid]
			},
			$on: function(type, handler) {
				if (!emitter) return noop
				return emitter.on(type, handler)
			},
			$emit: function () {
				if (!emitter) return
				emitter.emit.apply(emitter, arguments)
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
		useComponents(def, def.comps, `Component[${name || 'Anonymous'}]`, emitter)

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
		def.__$instance = function (et) {
			emitter = et
		}
		return def
	}
}
function noop() {}
component.use = useComponents
module.exports = component
