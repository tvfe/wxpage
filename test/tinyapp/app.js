
var d = new Date()
console.time('Run')
require('./lib/wxpage').A({
	config: {
		route: ['test/pages/$page', '/pages/$page'],
		resolvePath: function (name) {
			return '/pages/' + name
		}
	},
	onLaunch: function(opts) {
		console.log('APP is Running', opts)
	},
	onShow: function () {
	}
})
