'use strict'

var fns = require('./fns.js')
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
function component(name, ctor/*[ ctor ]*/) {
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
component.use = useComponents
module.exports = component
