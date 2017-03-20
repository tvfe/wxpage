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
