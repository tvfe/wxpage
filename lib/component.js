'use strict'

var fns = require('./fns.js')
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
						case 'onAwake':
						case 'onPreload':
						case 'onLaunch':
						// case 'fetchData':
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
		var vm
		var def = fns.type(ctor) == 'function'
			? ctor.call(this, {
				$set: function (data) {
					if (!cid || !vm) return
					vm.$setData(cid, data)
				}
			})
			: fns.extend({}, ctor)

		def.onLoad = fns.wrapFun(def.onLoad, function () {
			vm = this
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
			data[cid] = def.data
			data[cid].$id = cid
			def.data = data
		}
		return def
	}
}
component.use = useComponents
module.exports = component
