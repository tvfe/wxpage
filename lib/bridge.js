var getRef
module.exports = {
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
	}
}
