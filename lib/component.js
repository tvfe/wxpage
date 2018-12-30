'use strict'

var fns = require('./fns.js')
var bridge = require('./bridge.js')
var cache = require('./cache')
var conf = require('./conf')
var redirector = require('./redirector')
var message = require('./message')
var modules = {
	fns, redirector, cache, message, dispatcher,
	channel: bridge.channel
}
var dispatcher
/**
 * Component constructor
 */
var refs = {}
var cid = 0
function component(def) {
	if (!def) {
		console.error(`Illegal component options.`)
		def = {}
	}
	// extend page config
	var extendComponentBefore = conf.get('extendComponentBefore')
	extendComponentBefore && extendComponentBefore(def, modules)

	def.created = fns.wrapFun(def.created, function () {
		bridge.methods(this, dispatcher)
	})
	def.attached = fns.wrapFun(def.attached, function () {
		var id = ++cid
		this.$id = id
		refs[id] = this
		this._$ref = this.properties.ref || this.properties._ref
		this.triggerEvent('ing', {
			id: this.$id,
			type: 'attached'
		})
	})
	def.detached = fns.wrapFun(def.detached, function () {
		delete refs[this.$id]
		var $refs = this.$parent && this.$parent.$refs
		var refName = this._$ref
		if (refName && $refs) {
			delete $refs[refName]
		}
		this.$parent = null
	})
	def.properties = fns.extend({}, def.properties, {
    'ref': {
    	type: String,
      value: '',
      observer: function(next) {
      	/**
      	 * 支持动态 ref
      	 */
      	if (this._$ref !== next) {
					var $refs = this.$parent && this.$parent.$refs
					if ($refs) {
						let ref = $refs[this._$ref]
						delete $refs[this._$ref]
						this._$ref = next
						if (ref && next) {
							$refs[next]
						}
					}
      	}
      }
    },
	})
	def.methods = fns.extend({}, def.methods, {
		// 与旧的一致
		$set: function () {
			return this.setData.apply(this, arguments)
		},
		$data: function () {
			return this.data
		},
		$emit: function () {
			if (!dispatcher) return
			return dispatcher.emit.apply(dispatcher, arguments)
		},
		$on: function () {
			if (!dispatcher) return function () {}
			return dispatcher.on.apply(dispatcher, arguments)
		},
		$off: function () {
			if (!dispatcher) return
			return dispatcher.off.apply(dispatcher, arguments)
		},
		$call: function (method) {
			var args = [].slice.call(arguments, 1)
			this.triggerEvent('ing', {
				id: this.$id,
				type: 'event:call',
				method,
				args
			})
		},
		/**
		 * 由父组件调用
		 */
		_$attached: function (parent) {
			this.$root = parent.$root || parent
			this.$parent = parent
		},
		$: bridge.mount
	})
	Component(def)
}
component.getRef = function (id) {
	return refs[id]
}
bridge.ref(component.getRef)
component.dispatcher = function (d) {
	dispatcher = d
}
Component.C = component
module.exports = component
