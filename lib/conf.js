var fns = require('./fns')
var _conf = {
	nameResolve: function () {}
}
module.exports = {
	set: function (k, v) {
		switch(k) {
			case 'resolvePath':
				if (fns.type(v) == 'function') {
					_conf.customRouteResolve = v
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
						_conf.routeResolve = function (name) {
							return mainRoute.replace('$page', name)
						}
						_conf.nameResolve = function (url) {
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
			default:
				_conf[k] = v
		}
	},
	get: function (k) {
		return _conf[k]
	}
}

