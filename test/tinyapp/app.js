var wxpage = require('./lib/wxpage')
wxpage.A({
	config: {
		route: ['test/pages/$page', '/pages/$page'],
		resolvePath: function (name) {
			return '/pages/' + name
		}
	},
	onLaunch: function(opts) {
		wxpage.on('some_message', function (msg) {
			console.log('Receive message:', msg)
		})
		console.log('APP is Running', opts)
	},
	onAwake: function (time) {
		console.log('onAwake, after', time, 'ms')
	},
	onShow: function () {
		console.log('App onShow')
	}
})
